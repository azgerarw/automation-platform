from src.models.user import User
from fastapi import status, APIRouter # type: ignore
from pydantic import BaseModel # type: ignore
from db.db import get_connection

router = APIRouter()

class ToggleAlertBody(BaseModel):
    user_id: int
    newAlert: bool

@router.get("/fetchStatus/{user_id}", status_code=status.HTTP_200_OK)
async def fetch_alert_status(user_id: int):

    user = User()
    result = user.fetch_alert_status(user_id)

    if "error" in result:
        return {"error": result["error"]}

    return {
        "alertStatus": result["alerts"],
        "status": 200
    }

@router.patch("/toggle", status_code=status.HTTP_200_OK)
async def toggle_alerts(body: ToggleAlertBody):

    print(f"Received toggle request for user_id: {body.user_id} with new status: {body.newAlert}")
    user = User(user_id=body.user_id)
    result = user.toggle_alert_status(body.newAlert)

    if "error" in result:
        return {"error": result["error"]}


    return {
        "message": "Alerts status updated successfully",
        "newStatus": body.newAlert,
        "status": 200
    }