import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from datetime import datetime, timedelta
from database.database import Database
from models.db_models import User, Event, Ticket, Order
from passlib.hash import bcrypt
from pymongo.errors import DuplicateKeyError

USERS = [
    {"email": "test@example.com", "name": "Test User", "wallet_address": "0x1234567890abcdef"},
    {"email": "alice@example.com", "name": "Alice Wonderland", "wallet_address": "0xabcdef1234567890"},
    {"email": "bob@example.com", "name": "Bob Builder", "wallet_address": "0xdeadbeefcafebabe"},
]

EVENTS = [
    {"title": "Web3 Conference 2025", "description": "A conference about Web3 and blockchain technology", "venue": "Virtual", "days_from_now": 30},
    {"title": "Hackathon 2025", "description": "A 48-hour coding marathon!", "venue": "Tech Park", "days_from_now": 45},
    {"title": "Music Fest 2025", "description": "Live music from top artists.", "venue": "City Stadium", "days_from_now": 60},
]

TICKET_TYPES = [
    {"type": "VIP", "price": 0.1, "quantity": 100},
    {"type": "Regular", "price": 0.05, "quantity": 500}
]

async def init_database():
    db = Database()
    user_ids = {}
    # Create users
    for user_data in USERS:
        existing_user = await db.get_user_by_email(user_data["email"])
        if existing_user:
            user_id = existing_user["_id"]
        else:
            user = User(
                email=user_data["email"],
                password_hash=bcrypt.hash("password123"),
                name=user_data["name"],
                wallet_address=user_data["wallet_address"]
            )
            user_id = await db.create_user(user)
        user_ids[user_data["email"]] = user_id
        print(f"User {user_data['email']} has ID: {user_id}")

    # Create events (each organized by a different user)
    event_ids = []
    for i, event_data in enumerate(EVENTS):
        organizer_email = USERS[i % len(USERS)]["email"]
        event = Event(
            title=event_data["title"],
            description=event_data["description"],
            date=datetime.now() + timedelta(days=event_data["days_from_now"]),
            venue=event_data["venue"],
            organizer_id=user_ids[organizer_email],
            ticket_types=TICKET_TYPES
        )
        event_id = await db.create_event(event)
        event_ids.append(event_id)
        print(f"Event '{event_data['title']}' created with ID: {event_id}")

    # Create orders and tickets for each user for each event
    for user_email, user_id in user_ids.items():
        for event_id in event_ids:
            order = Order(
                user_id=user_id,
                event_id=event_id,
                ticket_type="VIP",
                quantity=1,
                total_amount=0.1,
                status="completed"
            )
            order_id = await db.create_order(order)
            ticket = Ticket(
                event_id=event_id,
                ticket_type="VIP",
                owner_id=user_id,
                nft_token_id=f"nft_{user_id}_{event_id}",
                status="active"
            )
            ticket_id = await db.create_ticket(ticket)
            print(f"Order {order_id} and Ticket {ticket_id} created for user {user_email} and event {event_id}")

    db.close()
    print("Database initialization with multiple users, events, orders, and tickets completed!")

if __name__ == "__main__":
    asyncio.run(init_database())
