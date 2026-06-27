import time
from fastapi import HTTPException # type: ignore
from src.config.logger import logger
from src.routers import executions
from src.handlers.event_handler import handle_event
from fastapi import FastAPI, Request, HTTPException  # type: ignore
from fastapi.responses import JSONResponse # type: ignore
import redis.asyncio as aioredis  # type: ignore # versión async de redis
import json
import asyncio
import psutil
import time
import os
import platform
from datetime import datetime, UTC
from db.ms import get_connection

app = FastAPI()

# -------------------------
# SECURITY HEADERS + SAFE ERRORS
# -------------------------

@app.middleware("http")
async def security_headers_and_error_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("Cross-Origin-Resource-Policy", "same-origin")
        return response
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "message": "An unexpected error occurred"},
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "Request failed", "message": "An error occurred processing the request"},
    )

@app.exception_handler(Exception)
async def exception_handler(_request: Request, _exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": "An unexpected error occurred"},
    )


red = aioredis.Redis(host="redis", port=6379, db=0)

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
    last_request_at = datetime.now(UTC)

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
            WHERE service_name = 'execution-service'
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

async def listen_for_events():
    logger.info("Starting to listen for events...")
    pubsub = red.pubsub()
    await pubsub.subscribe("events_channel")

    print("Listening for events...")

    async for message in pubsub.listen():
        
        if message["type"] == "message":
            
            data = json.loads(message["data"].decode("utf-8"))  # type: ignore

            logger.info("Event received", extra={"correlation_id": data.get("correlation_id"), "execution_id": data.get("execution_id"), "event": data.get("event"), "user_id": data.get("user_id"), "users_user": data.get("user"), "msg": data.get("msg")})

            await handle_event(data)

@app.on_event("startup")
async def startup_event():
    
    asyncio.create_task(listen_for_events())
    asyncio.create_task(update_metrics_loop())

@app.get("/health")
async def root(request: Request):

    start_time = time.time()

    # Tiempo de respuesta
    elapsed_time = time.time() - start_time

    # Correlation ID (lo puedes generar de alguna forma única si es necesario)
    correlation_id = "12345"  # Esto generalmente se genera o se pasa como un header

    # Log estructurado
    logger.info("Health check endpoint called", extra={
        "correlation_id": correlation_id,
        "method": request.method,
        "url": request.url.path,
        "status_code": 200,
        "elapsed_time": elapsed_time,
        "extra_info": "This is additional info for the health check log"
    })
    
    return {"status": "ok"}

app.include_router(executions.router, prefix="/executions")


if __name__ == "__main__":
    import uvicorn  # type: ignore
    uvicorn.run("src.server:app", host="0.0.0.0", port=5500, reload=True)