
from fastapi import APIRouter, HTTPException, status, Response, Request
from typing import Dict
from database.database import DB  
from utils.helpers.helpers import md5_hash
import secrets
router = APIRouter()

@router.post("/login")
async def login(request: Request, response: Response) -> Dict[str, str]:
    json_data = await request.json()
    user = DB.find_one({"username": json_data.get("username")}, DB.users_collection)
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

    existing_user = DB.find_one({"username": json_data.get("username")}, DB.users_collection)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    hashed_password = md5_hash(json_data.get("password"))
    new_user = {
        "username": json_data.get("username"),
        "password": hashed_password,
        "access-token": secrets.token_hex(16)
    }
    DB.insert_one(new_user, DB.users_collection)

    return {"message": "User registered successfully"}