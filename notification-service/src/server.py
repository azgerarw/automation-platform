from fastapi import FastAPI # type: ignore
from pydantic import BaseModel # type: ignore
from src.routers import actions
import asyncio
import psutil
import time
import os
import platform
from datetime import datetime
from db.ms import get_connection
from urllib.request import Request

import redis.asyncio as aioredis  # type: ignore # versión async de redis

red = aioredis.Redis(host="redis", port=6379, db=0)
app = FastAPI()

@app.get("/health")
async def root():
    return {"message": "Notification Service running"}

# =========================
# SERVICE METRICS
# =========================

START_TIME = time.time()

total_requests = 0
last_request_at = None

# =========================
# REQUEST MIDDLEWARE
# =========================

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    global total_requests
    global last_request_at

    total_requests += 1
    last_request_at = datetime.utcnow()

    response = await call_next(request)

    return response

def get_metrics():

    process = psutil.Process(os.getpid())

    memory_info = process.memory_info()

    uptime_seconds = int(time.time() - START_TIME)

    uptime_minutes = uptime_seconds / 60

    requests_per_minute = (
        total_requests / uptime_minutes
        if uptime_minutes > 0
        else total_requests
    )

    metrics = {
        "cpu_usage": psutil.cpu_percent(),

        "memory_usage_mb":
            memory_info.rss / 1024 / 1024,

        "rss":
            memory_info.rss,

        "heap_used":
            memory_info.vms,

        "uptime_seconds":
            uptime_seconds,

        "total_requests":
            total_requests,

        "requests_per_min":
            round(requests_per_minute, 2),

        "last_request_at":
            last_request_at,

        "pid":
            os.getpid(),

        "platform":
            platform.system(),

        "platform_version":
            platform.version(),

        "python_version":
            platform.python_version(),

        "active_connections":
            len(process.net_connections())
    }

    return metrics

# =========================
# HEARTBEAT LOOP
# =========================

async def update_metrics_loop():

    while True:

        metrics = get_metrics()


        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE microservices
            SET
                cpu_usage = %s,
                memory_usage_mb = %s,
                rss = %s,
                heapused = %s,
                uptime_seconds = %s,
                total_requests = %s,
                requests_per_min = %s,
                last_request_at = %s,
                pid = %s,
                platform = %s,
                version = %s,
                active_connections = %s
            WHERE service_name = 'notification-service'
        """, (
            metrics['cpu_usage'],
            metrics['memory_usage_mb'],
            metrics['rss'],
            metrics['heap_used'],
            metrics['uptime_seconds'],
            metrics['total_requests'],
            metrics['requests_per_min'],
            metrics['last_request_at'],
            metrics['pid'],
            metrics['platform'],
            metrics['python_version'],
            metrics['active_connections'],
        ))
        conn.commit()
        cursor.close()
        conn.close()

        await asyncio.sleep(10)

async def close_circuit():

    await asyncio.sleep(300)

    opened_at = await red.hget(
            "circuit",
            "opened_at"
        )
    
    opened_at = int(opened_at or 0)

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

@app.on_event("startup")
async def startup_event():
    
    asyncio.create_task(update_metrics_loop())
    asyncio.create_task(close_circuit())

app.include_router(prefix="/actions", router=actions.router)

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run("src.server:app", host="0.0.0.0", port=8000, reload=True)