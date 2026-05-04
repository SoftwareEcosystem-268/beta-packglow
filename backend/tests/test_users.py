"""
Tests for Users API — signup, login, profile, CRUD, validation
"""

import pytest


@pytest.mark.asyncio
async def test_signup_success(client, sample_user_data):
    resp = await client.post("/api/v1/users/", json=sample_user_data)
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "john@example.com"
    assert data["user"]["name"] == "John Doe"


@pytest.mark.asyncio
async def test_signup_duplicate_email(client, sample_user_data):
    await client.post("/api/v1/users/", json=sample_user_data)
    resp = await client.post("/api/v1/users/", json=sample_user_data)
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_signup_short_password(client):
    resp = await client.post(
        "/api/v1/users/",
        json={"name": "Test", "email": "short@example.com", "password": "abc"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_signup_empty_name(client):
    resp = await client.post(
        "/api/v1/users/",
        json={"name": "  ", "email": "empty@example.com", "password": "password123"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_signup_invalid_email(client):
    resp = await client.post(
        "/api/v1/users/",
        json={"name": "Test", "email": "not-an-email", "password": "password123"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client, sample_user_data):
    await client.post("/api/v1/users/", json=sample_user_data)
    resp = await client.post(
        "/api/v1/users/login",
        json={"email": "john@example.com", "password": "password123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client, sample_user_data):
    await client.post("/api/v1/users/", json=sample_user_data)
    resp = await client.post(
        "/api/v1/users/login",
        json={"email": "john@example.com", "password": "wrongpassword"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client):
    resp = await client.post(
        "/api/v1/users/login",
        json={"email": "nobody@example.com", "password": "password123"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(auth_client):
    resp = await auth_client.get("/api/v1/users/me")
    assert resp.status_code == 200
    assert resp.json()["email"] == "test@example.com"


@pytest.mark.asyncio
async def test_get_me_unauthenticated(client):
    resp = await client.get("/api/v1/users/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_all_users(auth_client, sample_user_data):
    resp = await auth_client.get("/api/v1/users/")
    assert resp.status_code == 200
    users = resp.json()
    assert isinstance(users, list)
    assert len(users) >= 1


@pytest.mark.asyncio
async def test_get_user_by_id(auth_client):
    me = await auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    resp = await auth_client.get(f"/api/v1/users/{user_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == user_id


@pytest.mark.asyncio
async def test_get_user_not_found(auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.get(f"/api/v1/users/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_user(auth_client):
    me = await auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    resp = await auth_client.delete(f"/api/v1/users/{user_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_user_not_found(auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.delete(f"/api/v1/users/{fake_id}")
    assert resp.status_code == 404
