import pytest
from fastapi.testclient import TestClient
from main import app
from database.database import Database

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def test_db():
    # Use a test database
    db = Database()
    db.database_uri = "mongodb://localhost:27017"
    db.db = db.Mclient["eventx_test"]
    return db

@pytest.fixture(autouse=True)
def cleanup(test_db):
    yield
    # Cleanup after each test
    for collection in test_db.db.list_collection_names():
        test_db.db[collection].delete_many({})
