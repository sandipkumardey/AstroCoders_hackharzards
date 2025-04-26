from fastapi import APIRouter, HTTPException, status, Request, Query, Depends, Body
from pydantic import BaseModel
from typing import Optional
from database.database import Database
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from starlette.requests import Request
import os

router = APIRouter()

# MongoDB setup (reuse your env vars)
# MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
# DATABASE_NAME = os.getenv("DATABASE_NAME", "eventx")
# client = MongoClient(MONGODB_URI)
# db = client[DATABASE_NAME]
# tickets_collection = db["tickets"]

# JWT secret (should come from env)
JWT_SECRET = os.getenv("JWT_SECRET", "testsecret")

bearer_scheme = HTTPBearer()

# Helper to get user_id from JWT
async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

class ResellRequest(BaseModel):
    ticketId: str
    price: float

class PurchaseRequest(BaseModel):
    ticketId: str
    buyer_wallet: str
    price: float

class TransferRequest(BaseModel):
    ticketId: str
    to_wallet: str

# Get tickets for a wallet
@router.get("")
async def get_tickets(wallet: str = Query(...)):
    db = Database()
    tickets = list(db.tickets.find({"owner_id": wallet}))
    for t in tickets:
        t["_id"] = str(t["_id"])
        t["event_id"] = str(t["event_id"])
        t["owner_id"] = str(t["owner_id"])
    db.close()
    return {"tickets": tickets}

# Get ticket details
@router.get("/{ticket_id}")
async def get_ticket_details(ticket_id: str):
    db = Database()
    ticket = db.tickets.find_one({"_id": db._convert_id(ticket_id)})
    db.close()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket["_id"] = str(ticket["_id"])
    ticket["event_id"] = str(ticket["event_id"])
    ticket["owner_id"] = str(ticket["owner_id"])
    return ticket

# Secure resell endpoint (only owner can resell, price validation)
@router.post("/resell")
async def resell_ticket(resell: ResellRequest, user_id: str = Depends(get_current_user_id)):
    db = Database()
    ticket = db.tickets.find_one({"_id": db._convert_id(resell.ticketId)})
    if not ticket:
        db.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
    if str(ticket["owner_id"]) != user_id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not own this ticket")
    if resell.price < 0.01 or resell.price > 10000:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid price range")
    result = db.tickets.update_one(
        {"_id": db._convert_id(resell.ticketId)},
        {"$set": {"status": "resale", "price": resell.price}}
    )
    db.close()
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update ticket")
    return {"success": True, "ticketId": resell.ticketId, "price": resell.price}

# Purchase a ticket (buy from resale)
@router.post("/purchase")
async def purchase_ticket(purchase: PurchaseRequest):
    db = Database()
    ticket = db.tickets.find_one({"_id": db._convert_id(purchase.ticketId)})
    if not ticket:
        db.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.get("status") != "resale":
        db.close()
        raise HTTPException(status_code=400, detail="Ticket is not available for purchase")
    # Transfer ownership and update status
    result = db.tickets.update_one(
        {"_id": db._convert_id(purchase.ticketId)},
        {"$set": {"owner_id": purchase.buyer_wallet, "status": "active", "price": purchase.price}}
    )
    db.close()
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to purchase ticket")
    return {"success": True, "ticketId": purchase.ticketId, "buyer_wallet": purchase.buyer_wallet}

# Transfer a ticket (owner to another wallet)
@router.post("/transfer")
async def transfer_ticket(transfer: TransferRequest, user_id: str = Depends(get_current_user_id)):
    db = Database()
    ticket = db.tickets.find_one({"_id": db._convert_id(transfer.ticketId)})
    if not ticket:
        db.close()
        raise HTTPException(status_code=404, detail="Ticket not found")
    if str(ticket["owner_id"]) != user_id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not own this ticket")
    result = db.tickets.update_one(
        {"_id": db._convert_id(transfer.ticketId)},
        {"$set": {"owner_id": transfer.to_wallet, "status": "transferred"}}
    )
    db.close()
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to transfer ticket")
    return {"success": True, "ticketId": transfer.ticketId, "to_wallet": transfer.to_wallet}
