import asyncio
import time
import redis.asyncio as aioredis  # type: ignore # versión async de redis
import json
red = aioredis.Redis(host="redis", port=6379, db=0)

async def retry(user_id, payload, event, correlation_id, execution_id, limit):
    import httpx  # type: ignore

    opened_at = await red.hget(
            "circuit",
            "opened_at"
        )
    
    opened_at = int(opened_at or 0)
    state = await red.hget(
            "circuit",
            "state"
    )

    if state == b'OPEN':
        
        if time.time() - opened_at < 300:
            print("Circuit open, skipping request")
            return False
        
        if time.time() - opened_at >= 300:
            
            print('circuit timeout expired')
            await red.hset(
                "circuit",
                mapping={
                    "state": "CLOSED",
                    "failures": 0,
                    "opened_at": 0
                }
            )

    async with httpx.AsyncClient() as client:

        state = await red.hget(
            "circuit",
            "state"
        )
        if state == b'CLOSED':
            
            for count in range(limit):
                print('try #: ', count)
                await asyncio.sleep(2 ** count)

                response = await client.post(
                    "http://notification-service:8000/actions/execute",
                    json={
                        "user_id": user_id,
                        "payload": payload,
                        "event": event
                    }
                )

                if response.status_code != 200:

                    await red.hincrby(
                        "circuit",
                        "failures",
                        1
                    )
                
                if response.status_code == 200:

                    await red.hset(
                        "circuit",
                        mapping={
                            "state": "CLOSED",
                            "failures": 0,
                            "opened_at": 0
                        }
                    )
                    return True

    failures = await red.hget(
                    "circuit",
                    "failures"
                )
    failures = int(failures or 0)
    
    if failures >= limit:
        await red.hset(
            "circuit",
            mapping={
                "state": "OPEN",
                "opened_at": int(time.time())
            }
        )

    print(f"Max retry attempts reached for user {user_id}, event {event}. Moving to DLQ.")

    await red.xadd(
        "dlq-stream",
        {   
            "correlation_id": correlation_id,
            "execution_id": execution_id,
            "user_id": user_id,
            "event": event,
            "payload": json.dumps(payload),
            "message": 'max retry attemps reached',
            "retries": limit,
            "error": "notification_failed",
            'queued_at': time.time()
        }
    )

    return False

        