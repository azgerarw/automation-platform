from db.db import get_connection

class User:
    def __init__(self, username: str=None, email: str=None, password: str=None, role: str=None, user_id: int=None):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.password = password
        self.role = role
    
    def create(self):

        conn = get_connection()
        cursor = conn.cursor()
 
        cursor.execute(
            "INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)",
            (self.username, self.email, self.password, self.role)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def fetch_by_email(self, email, username):
        
        conn = get_connection()
        cursor = conn.cursor()

        user_exist = cursor.execute("SELECT user_id FROM users WHERE email = %s OR username = %s", (email, username))
        if user_exist.fetchone():
            return {"error": "User already exists"}
        
        conn.commit()
        cursor.close()
        conn.close()
    
    def fetch_alert_status(self, user_id):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT alerts FROM users WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        
        if not result:
            return {"error": "User does not exist"}
        
        print(result)
        print(result[0])
        alerts_status = result[0]

        conn.commit()
        cursor.close()
        conn.close()

        return {"alerts": alerts_status}

    def toggle_alert_status(self, status:bool):

        conn = get_connection()
        cursor = conn.cursor()
        if self.user_id is None:
            return {"error": "User ID is required"}
        if status is None or not isinstance(status, bool):
            return {"error": "Alert status is required"}

        cursor.execute("UPDATE users SET alerts = %s WHERE user_id = %s", (status, self.user_id))
        
        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "Alerts status updated successfully"}

    def fetch_all_users(self):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE role = 'user'")
        users = cursor.fetchall()
        
        if not users:
            return {"error": "No users found"}

        conn.commit()
        cursor.close()
        conn.close()
        
        users_list = []

        for user in users:
            users_list.append({
                "user_id": user[0],
                "username": user[1],
                "email": user[2],
                "role": user[4],
                "created_at": user[5],
                "alerts": user[6],
                "active": user[7]
            })
        
        return {"users": users_list}