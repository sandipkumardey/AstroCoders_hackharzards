from fastapi import APIRouter, HTTPException, status, Response, Request
from typing import Dict
from database.database import Database  
from utils.helpers.helpers import md5_hash
import secrets
router = APIRouter()

@router.post("/login")
async def login(request: Request, response: Response) -> Dict[str, str]:
    json_data = await request.json()
    db = Database()
    user = await db.get_user_by_username(json_data.get("username"))
    db.close()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if md5_hash(json_data.get("password")) != user["password"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

    token = user.get("access-token")

    response.set_cookie(key="auth_token", value=token, httponly=True, secure=True, samesite="None")

    return {"message": "Login successful"}


@router.post("/register")
async def register(request: Request) -> Dict[str, str]:
    json_data = await request.json()

    db = Database()
    existing_user = await db.get_user_by_username(json_data.get("username"))
    db.close()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    hashed_password = md5_hash(json_data.get("password"))
    new_user = {
        "username": json_data.get("username"),
        "password": hashed_password,
        "access-token": secrets.token_hex(16)
    }
    db = Database()
    await db.create_user(new_user)
    db.close()

    return {"message": "User registered successfully"}