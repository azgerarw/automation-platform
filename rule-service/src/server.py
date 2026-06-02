from fastapi import FastAPI, status # type: ignore
from pydantic import BaseModel # type: ignore
from db.db import get_connection
import httpx # type: ignore
from datetime import datetime
from src.routers import rules
import asyncio
import psutil
import time
import os
import platform
from datetime import datetime
from db.ms import get_connection
from urllib.request import Request

now = datetime.now()
now

app = FastAPI()
app.include_router(rules.router, prefix="/rules")

class RuleBody(BaseModel):
    rule: str
    user_id: str

@app.get("/health")
async def root():
    return {"message": "Rule Service running"}

@app.post("/test", status_code=status.HTTP_201_CREATED)
async def create_rule(rule_body: RuleBody):

    conn = get_connection()
    cursor = conn.cursor()
    timestamp = datetime.now()
    if not rule_body.rule:
        return {"error": "something went wrong"}

    cursor.execute(
        "INSERT INTO rules (user_id, description, timestamp) VALUES (%s, %s, %s)",
        (rule_body.user_id, rule_body.rule, timestamp)
    )
    conn.commit()
    cursor.close()
    conn.close()

    # Simular evento hacia webhook-service
    event_payload = {
        "user_id": rule_body.user_id,
        "rule": rule_body.rule,
        "event": "RULE_CREATED"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://webhook-service:5000/test",
            json=event_payload
        )

    conn.close()

    if response.headers.get("content-type", "").startswith("application/json"):
        webhook_data = response.json()
    else:
        webhook_data = {
            "error": "Invalid response",
            "status_code": response.status_code,
            "raw": response.text
        }
        
    return {
        "message": "Rule created",
        "webhook_response": webhook_data
    }

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
            WHERE service_name = 'rule-service'
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

@app.on_event("startup")
async def startup_event():
    
    asyncio.create_task(update_metrics_loop())

if __name__ == "__main__":
    import uvicorn # type: ignore
    uvicorn.run("src.server:app", host="0.0.0.0", port=7000, reload=True)