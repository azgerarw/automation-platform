import traceback
import redis.asyncio as aioredis  # type: ignore # versión async de redis
import json
red = aioredis.Redis(host="redis", port=6379, db=0,
    decode_responses=True)
from db.db import get_connection

class Execution:
    def __init__(self, user_id=None, correlation_id=None, execution_id=None, status=None, finished_at=None):
        self.user_id = user_id
        self.correlation_id = correlation_id
        self.execution_id = execution_id
        self.status = status
        self.finished_at = finished_at

    def create(self):

        try:
            conn = get_connection()
            cursor = conn.cursor()
    
            cursor.execute(
                "INSERT INTO executions (user_id, correlation_id, execution_id, status) VALUES (%s, %s, %s, %s)",
                (self.user_id, self.correlation_id, self.execution_id, self.status)
            )
            
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Error creating execution record: {e}")

    def update(self):

        try:
            conn = get_connection()
            cursor = conn.cursor()
    
            cursor.execute(
                "UPDATE executions SET status = %s, finished_at = NOW() WHERE execution_id = %s",
                (self.status, self.execution_id)
            )
            
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Error updating execution record: {e}")

    def start_execution(self):
        
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE executions SET started_at = NOW(), status = 'running' WHERE execution_id = %s", (self.execution_id,))

        conn.commit()
        cursor.close()
        conn.close()

    def list_executions(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute(
            "SELECT json_agg(t)" \
            "FROM ( SELECT * FROM executions WHERE user_id = %s) t",
            (int(self.user_id),)
        )
        
        executions = cursor.fetchall()

        if not executions:
            raise ValueError(f"No executions found for user_id {self.user_id}")

        conn.commit()
        cursor.close()
        conn.close()

        return executions

    def list_all_executions(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute(
            "SELECT json_agg(t)" \
            "FROM ( SELECT * FROM executions ) t"
        )
        
        executions = cursor.fetchall()

        if not executions:
            raise ValueError(f"No executions found in db")

        conn.commit()
        cursor.close()
        conn.close()

        return executions
    
    def list_exec_by_id(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute("SELECT json_agg(t) FROM ( SELECT * FROM executions WHERE execution_id = %s) t", (self.execution_id,))
        
        execution = cursor.fetchone()

        if not execution:
            raise ValueError(f"No execution found in db")

        print('execution', execution)
        conn.commit()
        cursor.close()
        conn.close()

        return execution[0][0]

    def get_metrics(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        success = cursor.execute("SELECT COALESCE(COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / NULLIF(COUNT(*), 0),0) AS success_rate FROM executions")

        success_rate = success.fetchone()[0]

        if not success_rate:
            raise ValueError("No executions found")
        
        total = cursor.execute("SELECT COUNT(*) FROM executions")
        total_executions = total.fetchone()[0]

        if total_executions == 0:
            raise ValueError("No executions found")
        
        cursor.execute("SELECT AVG(executions_per_hour) AS avg_executions_per_hour FROM (SELECT DATE_TRUNC('hour', created_at) AS hour, COUNT(*) AS executions_per_hour FROM executions GROUP BY hour) t")
        executions_per_hour = cursor.fetchone()[0]

        cursor.execute("SELECT AVG(executions_per_hour) AS avg_executions_per_hour FROM (SELECT DATE_TRUNC('hour', created_at) AS hour, COUNT(*) AS executions_per_hour FROM executions WHERE status = 'completed' GROUP BY hour) t")
        completed_executions_per_hour = cursor.fetchone()[0]

        cursor.execute("SELECT AVG(EXTRACT(EPOCH FROM (finished_at - created_at)) * 1000) AS avg_latency_ms FROM executions WHERE status = 'completed' AND finished_at IS NOT NULL") 
        avg_latency = cursor.fetchone()[0]

        cursor.execute("SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (finished_at - created_at)) * 1000) AS p95_latency_ms FROM executions WHERE status = 'completed'")
        P95_latency = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM executions WHERE status IN ('queued')")
        queue_depth = cursor.fetchone()[0]

        cursor.execute("SELECT AVG(EXTRACT(EPOCH FROM (started_at - queued_at)) * 1000) AS avg_wait_time_ms FROM executions")
        queue_wait_time = cursor.fetchone()[0]

        conn.commit()
        cursor.close()
        conn.close()

        return {
            "total_executions": total_executions,
            "executions_per_hour": executions_per_hour if executions_per_hour is not None else 0,
            "completed_executions_per_hour": completed_executions_per_hour if completed_executions_per_hour is not None else 0,
            "failed_executions_per_hour": (executions_per_hour - completed_executions_per_hour) if executions_per_hour is not None and completed_executions_per_hour is not None else 0,
            "success_rate": success_rate,
            "failure_rate": 100 - success_rate,
            "average_latency": avg_latency if avg_latency is not None else 0,
            "P95_latency": P95_latency if P95_latency is not None else 0,
            "queue_depth": queue_depth if queue_depth is not None else 0,
            "queue_wait_time": queue_wait_time if queue_wait_time is not None else 0
        }

    async def get_queues(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute("SELECT json_agg(t) FROM (SELECT * FROM executions WHERE status = 'queued') t")
        queued_jobs = cursor.fetchall()

        cursor.execute("SELECT json_agg(t) FROM (SELECT * FROM executions WHERE status = 'running') t")
        running_jobs = cursor.fetchall()

        cursor.execute("SELECT json_agg(t) FROM (SELECT * FROM executions WHERE status = 'completed') t")
        completed_jobs = cursor.fetchall()

        cursor.execute("SELECT json_agg(t) FROM (SELECT * FROM executions WHERE status = 'failed') t")
        failed_jobs = cursor.fetchall()

        conn.commit()
        cursor.close()
        conn.close()

        try:
            print(await red.ping())

            dlq = await red.xrange(
                "dlq-stream",
                min="-",
                max="+"
            )


        except Exception:
            traceback.print_exc()
            dlq = []

        return {
            "queued jobs": queued_jobs if queued_jobs is not None else [],
            "running jobs": running_jobs if running_jobs is not None else [],
            "completed jobs": completed_jobs if completed_jobs is not None else [],
            "failed jobs": failed_jobs if failed_jobs is not None else [],
            "DLQ": dlq if dlq is not None else []
        }