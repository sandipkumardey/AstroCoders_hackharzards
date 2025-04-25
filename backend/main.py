from fastapi import FastAPI
from routes import payments, orders, nft
from fastapi.middleware.cors import CORSMiddleware
import routes.auth.login as auth
from middleware.middleware import AuthMiddleware
import uvicorn

app = FastAPI(
    title="Multi-Chain Event Ticketing API",
    version="1.0.0"
)

# CORS (Frontend Integration Ready)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(AuthMiddleware)
# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])  # Use /api prefix for all auth routes
# app.include_router(payments.router, prefix="/payments", tags=["Payments"])
# app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(nft.router, prefix="/nft", tags=["NFT Tickets"])

@app.get("/")
def root():
    return {"status": "API is up and running successfully!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
