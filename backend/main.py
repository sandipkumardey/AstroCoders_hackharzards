from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import payments, orders
import routes.auth.login as auth
from middleware.middleware import AuthMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuthMiddleware)

app.include_router(payments.router, prefix="/payments", tags=["Payments"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

@app.get("/")
def root():
    return {"message": "Welcome to the EventX API"}
