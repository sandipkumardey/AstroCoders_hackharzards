import os
import sys
from dotenv import load_dotenv
import json

config = None

def load_config():
    global config
    # Load environment variables
    load_dotenv()

    try:
        # Load config.json
        with open("config.json", "r") as f:
            config = json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        sys.exit(1)

    # Override with environment variables if they exist
    if os.getenv("MONGODB_URI"):
        config["database"]["url"] = os.getenv("MONGODB_URI")
    if os.getenv("DATABASE_NAME"):
        config["database"]["database_name"] = os.getenv("DATABASE_NAME")

    # Add environment-specific configurations
    config["jwt_secret"] = os.getenv("JWT_SECRET", "your-secret-key-here")
    config["stellar_network"] = os.getenv("STELLAR_NETWORK", "testnet")
    config["stellar_seed"] = os.getenv("STELLAR_SEED", "your-stellar-seed-here")
    config["rate_limit"] = int(os.getenv("RATE_LIMIT_PER_SECOND", "10"))

load_config()
