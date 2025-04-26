# routes/nft.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_nfts():
    return {"message": "NFT endpoints will be here"}