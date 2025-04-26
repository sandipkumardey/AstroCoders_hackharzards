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
    config["stellar_public_key"] = os.getenv("STELLAR_PUBLIC_KEY", "your-stellar-public-key-here")
    config["stellar_horizon_url"] = os.getenv("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
    config["base_private_key"] = os.getenv("BASE_PRIVATE_KEY", "your-base-private-key-here")
    config["base_public_address"] = os.getenv("BASE_PUBLIC_ADDRESS", "your-base-public-address-here")
    config["base_rpc_url"] = os.getenv("BASE_RPC_URL", "https://base-goerli.g.alchemy.com/v2/your-api-key")
    config["usdc_contract_address"] = os.getenv("USDC_CONTRACT_ADDRESS", "your-usdc-contract-address-here")
    config["rate_limit"] = int(os.getenv("RATE_LIMIT_PER_SECOND", "10"))

load_config()
