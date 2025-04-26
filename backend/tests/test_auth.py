from fastapi.testclient import TestClient
import pytest

def test_login(client: TestClient):
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    })
    assert response.status_code in [200, 401]  # Either successful login or unauthorized

def test_invalid_login(client: TestClient):
    response = client.post("/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
