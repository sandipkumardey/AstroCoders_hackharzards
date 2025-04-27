import os
from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset
from web3 import Web3
from utils.config.config import config

# --- STELLAR PAYMENT SENDER ---
def send_stellar_payment(destination: str, amount: float, asset_code: str = "USDC") -> str:
    server = Server(horizon_url=config["stellar_horizon_url"])
    source_keypair = Keypair.from_secret(config["stellar_seed"])
    source_account = server.load_account(account_id=source_keypair.public_key)
    base_fee = server.fetch_base_fee()
    asset = Asset(asset_code, config["stellar_public_key"])
    transaction = (
        TransactionBuilder(
            source_account=source_account,
            network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE if config["stellar_network"] == "testnet" else Network.PUBLIC_NETWORK_PASSPHRASE,
            base_fee=base_fee
        )
        .append_payment_op(destination=destination, amount=str(amount), asset=asset)
        .set_timeout(30)
        .build()
    )
    transaction.sign(source_keypair)
    response = server.submit_transaction(transaction)
    return response["hash"]

# --- BASE CHAIN (EVM) USDC/ETH SENDER ---
def send_base_payout(seller_wallet: str, amount: float, asset_code: str = "USDC") -> str:
    w3 = Web3(Web3.HTTPProvider(config["base_rpc_url"]))
    acct = w3.eth.account.from_key(config["base_private_key"])
    if asset_code == "USDC":
        usdc_contract = w3.eth.contract(address=Web3.to_checksum_address(config["usdc_contract_address"]), abi=[{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}])
        decimals = 6  # USDC decimals
        tx = usdc_contract.functions.transfer(
            Web3.to_checksum_address(seller_wallet),
            int(amount * (10 ** decimals))
        ).build_transaction({
            'from': acct.address,
            'nonce': w3.eth.get_transaction_count(acct.address),
            'gas': 100000,
            'gasPrice': w3.eth.gas_price
        })
        signed = acct.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        return tx_hash.hex()
    else:  # ETH
        tx = {
            'to': Web3.to_checksum_address(seller_wallet),
            'value': w3.to_wei(amount, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'nonce': w3.eth.get_transaction_count(acct.address)
        }
        signed = acct.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        return tx_hash.hex()