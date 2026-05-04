"""
Tests for Auth — token creation, verification, expired tokens
"""

import pytest
import time
from datetime import timedelta
from app.auth import create_access_token, decode_access_token


@pytest.mark.asyncio
async def test_health_check(client):
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_create_and_decode_token():
    token = create_access_token({"sub": "test-user-id"})
    payload = decode_access_token(token)
    assert payload["sub"] == "test-user-id"


def test_expired_token():
    token = create_access_token({"sub": "test-user-id"}, expires_delta=timedelta(seconds=-1))
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token(token)
    assert exc_info.value.status_code == 401


def test_invalid_token():
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        decode_access_token("invalid.token.here")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_auth_header_missing(client):
    resp = await client.get("/api/v1/users/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_auth_header_invalid_scheme(client):
    resp = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Basic dGVzdDp0ZXN0"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_auth_header_malformed_token(client):
    resp = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert resp.status_code == 401


# =============================================================================
# Login bug investigation — repeated login should work
# =============================================================================

@pytest.mark.asyncio
async def test_repeated_login(client):
    """Reproduce: signup → login → logout → login again should all work."""
    creds = {"email": "relogin@test.com", "password": "password123", "name": "Relogin Test"}

    # 1. Signup
    signup_resp = await client.post("/api/v1/users/", json=creds)
    assert signup_resp.status_code == 201
    signup_token = signup_resp.json()["access_token"]

    # 2. First login (after signup)
    login1 = await client.post("/api/v1/users/login", json={
        "email": creds["email"], "password": creds["password"]
    })
    assert login1.status_code == 200
    token1 = login1.json()["access_token"]

    # 3. Second login (simulate logout then login again)
    login2 = await client.post("/api/v1/users/login", json={
        "email": creds["email"], "password": creds["password"]
    })
    assert login2.status_code == 200
    token2 = login2.json()["access_token"]

    # 4. Third login — still works
    login3 = await client.post("/api/v1/users/login", json={
        "email": creds["email"], "password": creds["password"]
    })
    assert login3.status_code == 200

    # 5. Verify the last token is valid
    client.headers["Authorization"] = f"Bearer {token2}"
    me_resp = await client.get("/api/v1/users/me")
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == creds["email"]


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    """Wrong password returns 401, not 500."""
    creds = {"email": "wrongpw@test.com", "password": "password123", "name": "Wrong PW"}

    await client.post("/api/v1/users/", json=creds)

    resp = await client.post("/api/v1/users/login", json={
        "email": creds["email"], "password": "wrongpassword"
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    resp = await client.post("/api/v1/users/login", json={
        "email": "nobody@test.com", "password": "password123"
    })
    assert resp.status_code == 401
