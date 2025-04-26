from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
import qrcode
import io
import base64
from typing import Optional
from database.database import Database
import requests
import random

router = APIRouter()

class PaymentRequest(BaseModel):
    amount: float
    asset_code: str = "USDC"
    order_id: str
    buyer_email: str

class PaymentResponse(BaseModel):
    payment_address: str
    amount: float
    memo: str
    asset_code: str
    qr_code_base64: str

class PaymentStatusResponse(BaseModel):
    paid: bool
    tx_hash: Optional[str] = None
    message: str

@router.post("/initiate", response_model=PaymentResponse)
async def initiate_payment(req: PaymentRequest):
    payment_address = "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # TODO: Replace with your real address
    memo = str(uuid.uuid4())
    amount = req.amount
    asset_code = req.asset_code

    db = Database()
    await db.orders.update_one(
        {"_id": db._convert_id(req.order_id)},
        {"$set": {"memo": memo, "status": "pending"}},
        upsert=False
    )
    db.close()

    stellar_uri = f"web+stellar:pay?destination={payment_address}&amount={amount}&asset_code={asset_code}&memo={memo}"
    qr = qrcode.make(stellar_uri)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

    return PaymentResponse(
        payment_address=payment_address,
        amount=amount,
        memo=memo,
        asset_code=asset_code,
        qr_code_base64=qr_code_base64
    )

async def verify_stellar_payment(payment_address: str, memo: str, amount: float, asset_code: str = "USDC") -> Optional[str]:
    url = f"https://horizon.stellar.org/accounts/{payment_address}/payments?order=desc&limit=20"
    resp = requests.get(url)
    if resp.status_code != 200:
        return None
    data = resp.json()
    for p in data.get('_embedded', {}).get('records', []):
        if (
            p.get('type') == 'payment' and
            p.get('asset_code', '').upper() == asset_code.upper() and
            float(p.get('amount', 0)) >= float(amount) and
            p.get('memo') == memo
        ):
            return p.get('transaction_hash')
    return None

@router.get("/status/{order_id}", response_model=PaymentStatusResponse)
async def get_payment_status(order_id: str):
    db = Database()
    order = await db.get_order_by_id(order_id)
    db.close()
    if not order or "memo" not in order:
        raise HTTPException(status_code=404, detail="Order or memo not found")
    payment_address = "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"  # TODO: Replace with your real address
    tx_hash = await verify_stellar_payment(
        payment_address=payment_address,
        memo=order["memo"],
        amount=order["total_amount"],
        asset_code="USDC"
    )
    if tx_hash:
        db = Database()
        await db.update_order_status(order_id, "completed")
        db.close()
        return PaymentStatusResponse(paid=True, tx_hash=tx_hash, message="Payment received and verified.")
    return PaymentStatusResponse(paid=False, message="No matching payment found yet.")

@router.post("/webhook")
async def payment_webhook(payload: dict):
    memo = payload.get("memo")
    amount = float(payload.get("amount", 0))
    tx_hash = payload.get("transaction_hash")
    payment_address = payload.get("destination")
    asset_code = payload.get("asset_code", "USDC")
    db = Database()
    order = db.orders.find_one({"memo": memo})
    if order:
        db.orders.update_one({"_id": order["_id"]}, {"$set": {"status": "completed", "tx_hash": tx_hash}})
        db.close()
        return {"success": True, "message": "Order marked as completed."}
    db.close()
    return {"success": False, "message": "Order not found for memo."}

async def mock_base_payout(order_id: str, seller_wallet: str, amount: float, asset_code: str = "USDC") -> dict:
    """
    Simulate a payout to the seller on Base chain. Returns a fake transaction hash.
    """
    fake_tx_hash = f"0x{random.getrandbits(256):064x}"
    # Optionally, log payout in DB or file
    return {
        "order_id": order_id,
        "seller_wallet": seller_wallet,
        "amount": amount,
        "asset_code": asset_code,
        "tx_hash": fake_tx_hash,
        "status": "mocked"
    }

@router.post("/payout/{order_id}")
async def trigger_mock_payout(order_id: str):
    db = Database()
    order = await db.get_order_by_id(order_id)
    db.close()
    if not order or "seller_wallet" not in order or order.get("status") != "completed":
        raise HTTPException(status_code=400, detail="Order not eligible for payout or missing seller wallet.")
    payout = await mock_base_payout(
        order_id=order_id,
        seller_wallet=order["seller_wallet"],
        amount=order["total_amount"],
        asset_code="USDC"
    )
    # Optionally update order with payout info
    db = Database()
    await db.orders.update_one({"_id": db._convert_id(order_id)}, {"$set": {"base_payout": payout}})
    db.close()
    return {"success": True, "payout": payout}
