from fastapi import APIRouter, HTTPException, Query
from database.database import Database

router = APIRouter()

@router.get("/me")
async def get_user_me(wallet: str = Query(...)):
    db = Database()
    user = db.users.find_one({"wallet": wallet})
    db.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return {"user": user}
