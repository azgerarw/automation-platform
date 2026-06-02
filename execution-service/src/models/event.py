import json

from db.db import get_connection

class Event:
    def __init__(self, user_id=None, event_type=None, payload=None, correlation_id=None, status=None, execution_id=None):
        self.user_id = user_id
        self.event_type = event_type
        self.payload = payload if payload else {}
        self.correlation_id = correlation_id
        self.status = status
        self.execution_id = execution_id

    def create(self):

        try:
            conn = get_connection()
            cursor = conn.cursor()
    
            cursor.execute(
                "INSERT INTO events (user_id, event_type, payload, correlation_id, status, execution_id) VALUES (%s, %s, %s, %s, %s, %s)",
                (self.user_id, self.event_type, json.dumps(self.payload), self.correlation_id, self.status, self.execution_id)
            )
            
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Error creating event record: {e}")
