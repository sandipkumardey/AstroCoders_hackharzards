from typing import Optional, List, Dict, Any, Annotated
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from datetime import datetime
from bson import ObjectId

PyObjectId = Annotated[str, BeforeValidator(lambda x: str(ObjectId(x)) if isinstance(x, ObjectId) else x)]

class User(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: str
    password_hash: str
    name: str
    wallet_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Event(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    description: str
    date: datetime
    venue: str
    organizer_id: PyObjectId
    ticket_types: List[Dict[str, Any]]  # Contains price, quantity, type info
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Ticket(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    event_id: PyObjectId
    ticket_type: str
    owner_id: PyObjectId
    nft_token_id: Optional[str] = None
    status: str = "active"  # active, used, transferred
    purchase_date: datetime = Field(default_factory=datetime.utcnow)

class Order(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)
    
    id: Optional[PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: PyObjectId
    event_id: PyObjectId
    ticket_type: str
    quantity: int
    total_amount: float
    status: str = "pending"  # pending, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)