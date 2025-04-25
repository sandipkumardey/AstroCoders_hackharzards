from fastapi import HTTPException, status, Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse  #
from database.database import DB

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/auth"):
            return await call_next(request)

        token = request.cookies.get("auth_token")
        if not token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"code": 401, "message": "Unauthorized"}
            )
        
        user_data = DB.find_one({"access-token": token}, DB.users_collection)
        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"code": 401, "message": "Unauthorized"}
            )

        response = await call_next(request)
        return response
