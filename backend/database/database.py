from pymongo import MongoClient, DESCENDING
from pymongo.collection import Collection
from pymongo.cursor import Cursor
from pymongo.results import InsertOneResult, DeleteResult, UpdateResult
from bson import ObjectId
from typing import Dict, Any, Optional, List
from utils.config.config import config
from models.db_models import User, Event, Ticket, Order

class Database:
    def __init__(self):
        self.database_uri = config["database"]["url"]
        self.Mclient = MongoClient(self.database_uri)
        self.db = self.Mclient[config["database"]["database_name"]]
        
        # Initialize collections
        self.users = self.db['users']
        self.events = self.db['events']
        self.tickets = self.db['tickets']
        self.orders = self.db['orders']
        
        # Create indexes
        self._create_indexes()
    
    def _create_indexes(self):
        # Users collection indexes
        self.users.create_index("email", unique=True)
        self.users.create_index("wallet_address", sparse=True)
        
        # Events collection indexes
        self.events.create_index("organizer_id")
        self.events.create_index("date")
        
        # Tickets collection indexes
        self.tickets.create_index("event_id")
        self.tickets.create_index("owner_id")
        self.tickets.create_index("nft_token_id", sparse=True)
        
        # Orders collection indexes
        self.orders.create_index("user_id")
        self.orders.create_index("event_id")
        self.orders.create_index([("created_at", DESCENDING)])
    
    def _convert_id(self, id_str: str) -> ObjectId:
        return ObjectId(id_str)
    
    # User operations
    async def create_user(self, user: User) -> str:
        user_dict = user.model_dump(by_alias=True)
        if "_id" in user_dict and not user_dict["_id"]:
            del user_dict["_id"]
        result = self.users.insert_one(user_dict)
        return str(result.inserted_id)
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        result = self.users.find_one({"email": email})
        if result:
            result["_id"] = str(result["_id"])
        return result
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        result = self.users.find_one({"_id": self._convert_id(user_id)})
        if result:
            result["_id"] = str(result["_id"])
        return result
    
    async def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        result = self.users.find_one({"access-token": token})
        if result:
            result["_id"] = str(result["_id"])
        return result
    
    # Event operations
    async def create_event(self, event: Event) -> str:
        event_dict = event.model_dump(by_alias=True)
        if "_id" in event_dict and not event_dict["_id"]:
            del event_dict["_id"]
        event_dict["organizer_id"] = self._convert_id(event_dict["organizer_id"])
        result = self.events.insert_one(event_dict)
        return str(result.inserted_id)
    
    async def get_event_by_id(self, event_id: str) -> Optional[Dict[str, Any]]:
        result = self.events.find_one({"_id": self._convert_id(event_id)})
        if result:
            result["_id"] = str(result["_id"])
            result["organizer_id"] = str(result["organizer_id"])
        return result
    
    async def list_events(self, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        cursor = self.events.find().skip(skip).limit(limit)
        events = []
        for event in cursor:
            event["_id"] = str(event["_id"])
            event["organizer_id"] = str(event["organizer_id"])
            events.append(event)
        return events
    
    # Ticket operations
    async def create_ticket(self, ticket: Ticket) -> str:
        ticket_dict = ticket.model_dump(by_alias=True)
        if "_id" in ticket_dict and not ticket_dict["_id"]:
            del ticket_dict["_id"]
        ticket_dict["event_id"] = self._convert_id(ticket_dict["event_id"])
        ticket_dict["owner_id"] = self._convert_id(ticket_dict["owner_id"])
        result = self.tickets.insert_one(ticket_dict)
        return str(result.inserted_id)
    
    async def get_user_tickets(self, user_id: str) -> List[Dict[str, Any]]:
        cursor = self.tickets.find({"owner_id": self._convert_id(user_id)})
        tickets = []
        for ticket in cursor:
            ticket["_id"] = str(ticket["_id"])
            ticket["event_id"] = str(ticket["event_id"])
            ticket["owner_id"] = str(ticket["owner_id"])
            tickets.append(ticket)
        return tickets
    
    async def update_ticket_status(self, ticket_id: str, status: str) -> bool:
        result = self.tickets.update_one(
            {"_id": self._convert_id(ticket_id)},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0
    
    # Order operations
    async def create_order(self, order: Order) -> str:
        order_dict = order.model_dump(by_alias=True)
        if "_id" in order_dict and not order_dict["_id"]:
            del order_dict["_id"]
        order_dict["user_id"] = self._convert_id(order_dict["user_id"])
        order_dict["event_id"] = self._convert_id(order_dict["event_id"])
        result = self.orders.insert_one(order_dict)
        return str(result.inserted_id)
    
    async def get_order_by_id(self, order_id: str) -> Optional[Dict[str, Any]]:
        result = self.orders.find_one({"_id": self._convert_id(order_id)})
        if result:
            result["_id"] = str(result["_id"])
            result["user_id"] = str(result["user_id"])
            result["event_id"] = str(result["event_id"])
        return result
    
    async def update_order_status(self, order_id: str, status: str) -> bool:
        result = self.orders.update_one(
            {"_id": self._convert_id(order_id)},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0
    
    def close(self):
        self.Mclient.close()