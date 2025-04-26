import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from datetime import datetime, timedelta
from database.database import Database
from models.db_models import User, Event, Ticket, Order
from passlib.hash import bcrypt
from pymongo.errors import DuplicateKeyError
import random

USERS = [
    {"email": "test@example.com", "name": "Test User", "wallet_address": "0x1234567890abcdef"},
    {"email": "alice@example.com", "name": "Alice Wonderland", "wallet_address": "0xabcdef1234567890"},
    {"email": "bob@example.com", "name": "Bob Builder", "wallet_address": "0xdeadbeefcafebabe"},
]

TICKET_TYPES = [
    {"type": "VIP", "price": 0.1, "quantity": 100},
    {"type": "Regular", "price": 0.05, "quantity": 500},
    {"type": "Early Bird", "price": 0.02, "quantity": 50},
    {"type": "Student", "price": 0.01, "quantity": 100},
    {"type": "Backstage", "price": 0.2, "quantity": 10},
]

EVENTS = [
    {"title": "Web3 Conference 2025",
     "description": "A conference about Web3, blockchain, and decentralized apps. Includes workshops and networking.",
     "venue": "Virtual",
     "days_from_now": 30,
     "extra": {"category": "Tech", "sponsors": ["Stellar", "Base"]}},
    {"title": "Hackathon 2025",
     "description": "A 48-hour coding marathon with prizes for top teams. Includes AI, blockchain, and web tracks.",
     "venue": "Tech Park",
     "days_from_now": 45,
     "extra": {"category": "Coding", "prize_pool": "10,000 USDC"}},
    {"title": "Music Fest 2025",
     "description": "Live music from top artists. Food trucks, games, and NFT collectibles available.",
     "venue": "City Stadium",
     "days_from_now": 60,
     "extra": {"category": "Music", "headliners": ["DJ Stellar", "Crypto Beats"]}},
    {"title": "Startup Expo 2025",
     "description": "Showcase of the hottest Web3 and AI startups. Investor networking and pitch sessions.",
     "venue": "Expo Center",
     "days_from_now": 75,
     "extra": {"category": "Business", "featured_startups": 20}},
]

ORDER_STATUSES = ["pending", "completed", "cancelled", "failed"]

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
            ticket_types=TICKET_TYPES,
            **event_data.get("extra", {})
        )
        event_id = await db.create_event(event)
        event_ids.append(event_id)
        print(f"Event '{event_data['title']}' created with ID: {event_id}")

    # Create orders and tickets for each user for each event
    for user_email, user_id in user_ids.items():
        for event_id in event_ids:
            # Randomly select a ticket type and order status
            ticket_type = random.choice(TICKET_TYPES)["type"]
            order_status = random.choice(ORDER_STATUSES)
            order = Order(
                user_id=user_id,
                event_id=event_id,
                ticket_type=ticket_type,
                quantity=random.randint(1, 3),
                total_amount=round(random.uniform(0.01, 0.2), 2),
                status=order_status
            )
            order_id = await db.create_order(order)
            ticket = Ticket(
                event_id=event_id,
                ticket_type=ticket_type,
                owner_id=user_id,
                nft_token_id=f"nft_{user_id}_{event_id}_{ticket_type}",
                status="active" if order_status == "completed" else "pending"
            )
            ticket_id = await db.create_ticket(ticket)
            print(f"Order {order_id} ({order_status}) and Ticket {ticket_id} ({ticket_type}) created for user {user_email} and event {event_id}")

    db.close()
    print("Database initialization with complex sample data completed!")

if __name__ == "__main__":
    asyncio.run(init_database())
