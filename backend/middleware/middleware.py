from fastapi import HTTPException, status, Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse  #
from database.database import Database

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
        
        db = Database()
        user_data = await db.get_user_by_token(token)
        db.close()
        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"code": 401, "message": "Unauthorized"}
            )

        response = await call_next(request)
        return response
