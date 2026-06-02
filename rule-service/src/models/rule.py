import json
from db.db import get_connection

class Rule:
    def __init__(self, user_id=None, rule=None, rule_id=None, event_type=None):
        self.user_id = user_id
        self.rule = rule
        self.rule_id = rule_id
        self.event_type = event_type

    def create(self):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM rules WHERE user_id = %s AND event_type = %s",
            (self.user_id, self.event_type)
        )

        if cursor.fetchone():
            raise ValueError(f"Rule already exists for user_id {self.user_id} and event_type {self.event_type}")

        cursor.execute(
            "INSERT INTO rules (user_id, rule, event_type) VALUES (%s, %s, %s)",
            (self.user_id, json.dumps(self.rule), self.event_type)
        )

        new_rule = cursor.execute(
            "SELECT rule_id FROM rules WHERE rule = %s",
            (json.dumps(self.rule),)
        )
        new_rule = cursor.fetchone()[0]

        cursor.execute(
            "INSERT INTO retry_policy (rule_id) VALUES (%s)",
            (new_rule,)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def update(self):

        conn = get_connection()
        cursor = conn.cursor()
 
        cursor.execute(
            "UPDATE rules SET rule = %s WHERE rule_id = %s",
            (json.dumps(self.rule), self.rule_id)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def toggle_state(self, state):

        conn = get_connection()
        cursor = conn.cursor()

        if state == True:
            cursor.execute(
                "UPDATE rules SET active = %s WHERE rule_id = %s",
                (True, self.rule_id)
            )
        else:
            cursor.execute(
                "UPDATE rules SET active = %s WHERE rule_id = %s",
                (False, self.rule_id)
            )
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def list_rules(self):

        conn = get_connection()
        cursor = conn.cursor()

        
        cursor.execute(
            "SELECT json_agg(t)" \
            "FROM ( SELECT * FROM rules WHERE user_id = %s) t",
            (self.user_id,)
        )
        
        rules = cursor.fetchall()

        if not rules:
            raise ValueError(f"No rules found for user_id {self.user_id}")

        conn.commit()
        cursor.close()
        conn.close()

        return rules

    def delete(self):

        conn = get_connection()
        cursor = conn.cursor()
     
        cursor.execute(
            "DELETE FROM rules WHERE rule_id = %s",
            (self.rule_id,)
        )

        if cursor.rowcount == 0:
            raise ValueError(f"No rule found with rule_id {self.rule_id} to delete")

        conn.commit()
        cursor.close()
        conn.close()

        return

    def update_retry_policy(self, limit):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE retry_policy SET attempts = %s, last_modified = NOW() WHERE rule_id = %s",
            (limit, self.rule_id)
        )

        if cursor.rowcount == 0:
            raise ValueError(f"No retry policy found for rule_id {self.rule_id} to update")

        conn.commit()
        cursor.close()
        conn.close()

        return
    
    def update_global_retry(self, limit, delay):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE retry_policy SET attempts = %s, delay = %s, last_modified = NOW()",
            (limit, delay)
        )

        if cursor.rowcount == 0:
            raise ValueError(f"No retry policy found")

        conn.commit()
        cursor.close()
        conn.close()

        return