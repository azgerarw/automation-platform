import re

import bcrypt
from src.models.user import User
from fastapi import status, APIRouter # type: ignore
from pydantic import BaseModel # type: ignore
from db.db import get_connection

router = APIRouter()

class UserBody(BaseModel):
    username: str
    email: str
    password: str
    role: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_User(user_body: UserBody):

    
    if not user_body.username or not user_body.email or not user_body.password or not user_body.role:
        return {"error": "Missing fields"}

    password_regex = { 
            "regex": r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$",
            "error": "Password must include at least 1 cap letter, 1 lowercase letter, 1 number and 1 special character"
        }
    
    email_regex = {
            "regex": r"^[\w\.-]+@[\w\.-]+\.\w{2,}$",
            "error": "Invalid email"
    }
    password = user_body.password
    if re.match(password_regex['regex'], password):

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    else:
        return { "error": password_regex["error"]}

    if re.match(email_regex["regex"], user_body.email):
        print("email ok")
    else:
        return { "error": email_regex["error"]}
    
    
    user = User(email=user_body.email, username=user_body.username, password=hashed, role=user_body.role)

    if user.fetch_by_email(user_body.email, user_body.username) == {"error": "User already exists"}:
        return {"error": "User already exists"}
    else:
        user.create()

    return {
        "message": "User created",
        "status": 201
    }

@router.get("/list", status_code=status.HTTP_200_OK)
async def list_users():

    user = User()
    users = user.fetch_all_users()


    if not users:
        return {"error": "No users found", "status": 404}
    
    return {"users": users["users"], "status": 200}

@router.get("/{email}")
async def fetch_user(email: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    
    user = cursor.fetchone()
    
    if not user:
        return {"error": "User does not exist", "status": 404}
    
    return {"user": {"id": user[0], "username": user[1], "email": user[2], "password": user[3], "role": user[4]}, "status": 200}

