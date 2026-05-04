"""
Tests for Saved Outfits API — save, list, get, delete, auth, pro check
"""

import pytest


@pytest.mark.asyncio
async def test_save_outfit_pro_user(pro_auth_client, sample_outfit_id):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["outfit_id"] == sample_outfit_id
    assert data["user_id"] == user_id


@pytest.mark.asyncio
async def test_save_outfit_free_user_forbidden(auth_client, sample_outfit_id):
    me = await auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    resp = await auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_save_outfit_unauthenticated(client, sample_outfit_id):
    resp = await client.post(
        "/api/v1/saved-outfits/?user_id=00000000-0000-0000-0000-000000000000",
        json={"outfit_id": sample_outfit_id},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_save_outfit_nonexistent_outfit(pro_auth_client):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]
    fake_outfit = "00000000-0000-0000-0000-000000000000"

    resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": fake_outfit},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_save_outfit_nonexistent_user(pro_auth_client, sample_outfit_id):
    fake_user = "00000000-0000-0000-0000-000000000000"

    resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={fake_user}",
        json={"outfit_id": sample_outfit_id},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_save_outfit_duplicate(pro_auth_client, sample_outfit_id):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )

    resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_get_saved_outfits(pro_auth_client, sample_outfit_id):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )

    resp = await pro_auth_client.get(f"/api/v1/saved-outfits/?user_id={user_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["outfit_id"] == sample_outfit_id


@pytest.mark.asyncio
async def test_get_saved_outfit_by_id(pro_auth_client, sample_outfit_id):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    save_resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )
    saved_id = save_resp.json()["id"]

    resp = await pro_auth_client.get(f"/api/v1/saved-outfits/{saved_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == saved_id


@pytest.mark.asyncio
async def test_get_saved_outfit_not_found(pro_auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await pro_auth_client.get(f"/api/v1/saved-outfits/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_saved_outfit(pro_auth_client, sample_outfit_id):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    save_resp = await pro_auth_client.post(
        f"/api/v1/saved-outfits/?user_id={user_id}",
        json={"outfit_id": sample_outfit_id},
    )
    saved_id = save_resp.json()["id"]

    resp = await pro_auth_client.delete(f"/api/v1/saved-outfits/{saved_id}")
    assert resp.status_code == 204

    verify = await pro_auth_client.get(f"/api/v1/saved-outfits/{saved_id}")
    assert verify.status_code == 404


@pytest.mark.asyncio
async def test_delete_saved_outfit_not_found(pro_auth_client):
    fake_id = "00000000-0000-0000-0000-000000000000"
    resp = await pro_auth_client.delete(f"/api/v1/saved-outfits/{fake_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_get_saved_outfits_empty(pro_auth_client):
    me = await pro_auth_client.get("/api/v1/users/me")
    user_id = me.json()["id"]

    resp = await pro_auth_client.get(f"/api/v1/saved-outfits/?user_id={user_id}")
    assert resp.status_code == 200
    assert resp.json() == []
