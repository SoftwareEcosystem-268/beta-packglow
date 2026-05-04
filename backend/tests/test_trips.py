"""
Tests for Trips API — create, list, get, update, delete
"""

import pytest


async def _get_user_id(auth_client) -> str:
    me = await auth_client.get("/api/v1/users/me")
    return me.json()["id"]


@pytest.mark.asyncio
async def test_create_trip(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id

    resp = await auth_client.post("/api/v1/trips/", json=sample_trip_data)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Beach Vacation"
    assert data["destination_type"] == "beach"
    assert data["duration_days"] == 5


@pytest.mark.asyncio
async def test_create_trip_invalid_destination_type(auth_client):
    user_id = await _get_user_id(auth_client)
    resp = await auth_client.post(
        "/api/v1/trips/",
        json={
            "user_id": user_id,
            "destination_type": "space",
            "duration_days": 3,
        },
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_trip_nonexistent_user(auth_client):
    fake_user = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.post(
        "/api/v1/trips/",
        json={
            "user_id": fake_user,
            "destination_type": "beach",
            "duration_days": 3,
        },
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_all_trips(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id
    await auth_client.post("/api/v1/trips/", json=sample_trip_data)

    resp = await auth_client.get("/api/v1/trips/")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
    assert len(resp.json()) >= 1


@pytest.mark.asyncio
async def test_get_trips_filtered_by_user(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id
    await auth_client.post("/api/v1/trips/", json=sample_trip_data)

    resp = await auth_client.get(f"/api/v1/trips/?user_id={user_id}")
    assert resp.status_code == 200
    trips = resp.json()
    assert all(t["user_id"] == user_id for t in trips)


@pytest.mark.asyncio
async def test_get_trip_by_id(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id
    created = await auth_client.post("/api/v1/trips/", json=sample_trip_data)
    trip_id = created.json()["id"]

    resp = await auth_client.get(f"/api/v1/trips/{trip_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == trip_id


@pytest.mark.asyncio
async def test_get_trip_not_found(auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.get(f"/api/v1/trips/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_trip(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id
    created = await auth_client.post("/api/v1/trips/", json=sample_trip_data)
    trip_id = created.json()["id"]

    resp = await auth_client.patch(
        f"/api/v1/trips/{trip_id}",
        json={"duration_days": 10, "status": "ongoing"},
    )
    assert resp.status_code == 200
    assert resp.json()["duration_days"] == 10
    assert resp.json()["status"] == "ongoing"


@pytest.mark.asyncio
async def test_update_trip_not_found(auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.patch(
        f"/api/v1/trips/{fake_id}",
        json={"duration_days": 10},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_trip(auth_client, sample_trip_data):
    user_id = await _get_user_id(auth_client)
    sample_trip_data["user_id"] = user_id
    created = await auth_client.post("/api/v1/trips/", json=sample_trip_data)
    trip_id = created.json()["id"]

    resp = await auth_client.delete(f"/api/v1/trips/{trip_id}")
    assert resp.status_code == 204

    # Verify deleted
    get_resp = await auth_client.get(f"/api/v1/trips/{trip_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_trip_not_found(auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await auth_client.delete(f"/api/v1/trips/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_trips_require_auth(client, sample_trip_data):
    """All trip endpoints require authentication."""
    resp = await client.get("/api/v1/trips/")
    assert resp.status_code == 401
