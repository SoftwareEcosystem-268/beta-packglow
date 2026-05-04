"""
Tests for Packing Assistant API — generate, validation, auth
"""

import pytest


@pytest.mark.asyncio
async def test_generate_packing_free_user(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 3,
        "activities": ["swimming"],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "packing_list" in data
    # Free tier: fields exist but are empty
    assert data.get("custom_suggestions") == [] or data.get("custom_suggestions") is None
    assert data.get("outfits") == [] or data.get("outfits") is None


@pytest.mark.asyncio
async def test_generate_packing_pro_user(pro_auth_client):
    resp = await pro_auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "city",
        "duration_days": 7,
        "activities": ["shopping", "dinner"],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "packing_list" in data
    assert len(data.get("custom_suggestions", [])) > 0
    assert len(data.get("outfits", [])) > 0


@pytest.mark.asyncio
async def test_generate_packing_unauthenticated(client):
    resp = await client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 3,
    })
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_generate_packing_invalid_destination_type(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "space",
        "duration_days": 3,
    })
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_generate_packing_duration_too_long(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 100,
    })
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_generate_packing_duration_zero(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 0,
    })
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_generate_packing_all_destination_types(auth_client):
    for dest_type in ["beach", "mountain", "city", "abroad", "ceremony"]:
        resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
            "destination_type": dest_type,
            "duration_days": 3,
        })
        assert resp.status_code == 200, f"Failed for {dest_type}"


@pytest.mark.asyncio
async def test_generate_packing_no_activities(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 2,
    })
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_generate_packing_packing_list_structure(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 3,
        "activities": ["swimming"],
    })
    data = resp.json()
    packing = data["packing_list"]
    for key in ["clothes", "personal", "health", "electronics", "documents", "others"]:
        assert key in packing, f"Missing category: {key}"
        assert isinstance(packing[key], list)


@pytest.mark.asyncio
async def test_tier_override_free_user_sends_pro(auth_client):
    """Server must override client-sent tier with the real DB tier."""
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 3,
        "user_tier": "pro",  # client tries to send pro
    })
    assert resp.status_code == 200
    data = resp.json()
    # auth_client is free tier, so suggestions/outfits should be empty
    assert data.get("custom_suggestions") == [] or data.get("custom_suggestions") is None
    assert data.get("outfits") == [] or data.get("outfits") is None


@pytest.mark.asyncio
async def test_generate_packing_with_activities(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "beach",
        "duration_days": 5,
        "activities": ["swimming", "photography", "snorkeling"],
    })
    assert resp.status_code == 200
    assert "packing_list" in resp.json()


@pytest.mark.asyncio
async def test_generate_packing_max_duration(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "city",
        "duration_days": 90,
    })
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_generate_packing_min_duration(auth_client):
    resp = await auth_client.post("/api/v1/packing-assistant/generate", json={
        "destination_type": "city",
        "duration_days": 1,
    })
    assert resp.status_code == 200
