from fastapi import APIRouter

router = APIRouter()

@router.post("/initiate")
def initiate_payment():
    return {"msg": "Stellar payment initiated"}
