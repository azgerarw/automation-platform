from src.models.execution import Execution
from src.models.event import Event
from src.config.retry_strategy import retry
from db.db import get_connection
from simpleeval import simple_eval # type: ignore
import redis.asyncio as aioredis # type: ignore
import json, asyncio
import httpx # type: ignore

red = aioredis.Redis(host="redis", port=6379, db=0)

async def handle_event(data: dict):
    
    payload = data.get("payload", {})
    event_type = data.get("event", "")
    user_id = data.get("user_id", "")
    users_user = data.get("user", "")
    msg = data.get("msg", "")
    correlation_id = data.get("correlation_id", "")
    execution_id = data.get("execution_id", "")

    execution = Execution(user_id=user_id, correlation_id=correlation_id, execution_id=execution_id, status="queued")

    conn = get_connection()
    
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM rules WHERE event_type = %s AND active = true AND user_id = %s", (data.get("event"), user_id))
    rules = cursor.fetchall()

    
    for rule in rules:
        rule_data = rule[2]
        execution.start_execution()
        cursor.execute("SELECT * FROM retry_policy WHERE rule_id = %s", (rule[0],))
        retry_strategy = cursor.fetchone()

        if isinstance(rule_data, str):
            rule_data = json.loads(rule_data)

        OPERATORS = {
            "eq": "==",
            "neq": "!=",
            "gt": ">",
            "gte": ">=",
            "lt": "<",
            "lte": "<="
        }

        results = []

        for condition in rule_data["conditions"]:

            try:
                operator = OPERATORS.get(condition["operator"])

                if not operator:
                    print("Invalid operator")
                    continue

                field = condition["field"]

                payload_value = payload.get(field)
                condition_value = condition["value"]

                if isinstance(payload_value, int):
                    condition_value = int(condition_value)

                expr = f"payload['{field}'] {operator} {repr(condition_value)}"

                result = simple_eval(expr, names={"payload": payload})

                results.append(result)

            except Exception as e:
                print("Error evaluating condition:", e)
                continue

        if results and all(results):

            print("Executing action")

            print("Executing action for user:", user_id)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "http://notification-service:8000/actions/execute",
                    json={
                        "user": users_user,
                        "msg": msg,
                        "payload": payload,
                        "event": event_type,
                        "actions": rule_data["actions"]
                    }
                )
            
                if response.status_code != 200:
                    print(f"Failed to send notification for user {user_id}: {response.text}")

                    execution.status = "failed"
                    execution.update()

                    event = Event(user_id=user_id, event_type=event_type, payload=payload, correlation_id=correlation_id, status="failed", execution_id=execution_id)
                    event.create() 
                    success = await retry(user_id, payload, event_type, correlation_id, execution_id, retry_strategy[1])
                    if not success:
                        return

            execution.status = "completed"
            execution.update()

            event_record = Event(user_id=user_id, event_type=event_type, payload=payload, correlation_id=correlation_id, status="processed", execution_id=execution_id)
            event_record.create()

            await red.publish("executions_channel", json.dumps({
                "message": "Event processed and action executed",
                "execution_id": execution_id,
                "user_id": user_id}))

            await red.publish("ev_channel", json.dumps({
                "message": "Event processed and action executed",
                "correlation_id": correlation_id,
                "user_id": user_id}))
    
            return

    conn.commit()
    cursor.close()
    conn.close()

    execution.status = "failed"
    execution.update()

    event_record = Event(user_id=user_id, event_type=event_type, payload=payload, correlation_id=correlation_id, status="failed", execution_id=execution_id)
    event_record.create() 
    
    await red.publish("executions_channel", json.dumps({
        "message": "Event processed but no rules matched",
        "execution_id": execution_id,
        "user_id": user_id}))

    await red.publish("ev_channel", json.dumps({
        "message": "Event processed but no rules matched",
        "correlation_id": correlation_id,
        "user_id": user_id}))
    
    