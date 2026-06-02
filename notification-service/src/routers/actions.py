from fastapi import status, APIRouter, HTTPException # type: ignore
from pydantic import BaseModel # type: ignore
import requests
import smtplib
from email.message import EmailMessage

router = APIRouter()

class EventBody(BaseModel):
    user: str
    msg: str
    payload: dict
    event: str
    actions: list

@router.post("/execute", status_code=status.HTTP_200_OK)
async def execute_actions(event_body: EventBody):

    actions = event_body.actions
    message = event_body.msg
    try:
        for action in actions:

            if action["type"] == "discord":
                WEBHOOK_URL = action["config"].get("webhook")
                
                print(f"Sending notification to Discord at {WEBHOOK_URL}")
                
                response = requests.post(WEBHOOK_URL, json={
                    "content": f"{message}"
                })
                
                response.raise_for_status()
                
            if action["type"] == "email":
                print("Preparing email notification")
                email_address = action["config"].get("to")
                print(f"Sending email notification to {email_address}")
                

                msg = EmailMessage()

                msg["Subject"] = f"{event_body.event} notification for user {event_body.user}"
                msg["From"] = "your_company_email@gmail.com"
                msg["To"] = f"{email_address}"

                msg.add_alternative(f"""
                <html>
                    <body>
                        <h4>Notification: </h4>
                        <p>{message}.</p>
                    </body>
                    <footer>
                        <p>Best regards,</p>
                        <p>Automation Platform Team</p>
                    </footer>
                </html>
                """, subtype="html")

                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                    smtp.login("your_company_email@gmail.com", "your_email_apps_password")
                    smtp.send_message(msg)

    except requests.exceptions.RequestException as e:
        print(f"Error sending message to Discord: {e}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to send notification: {e}"
        )

    return {
        "message": "Discord notification sent",
        "status": 200
    }
