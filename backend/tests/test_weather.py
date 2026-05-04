"""
Tests for Weather API — fallback responses, params, error handling
"""

import pytest


@pytest.mark.asyncio
async def test_weather_beach_fallback(client):
    resp = await client.get("/api/v1/weather/beach")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "beach"
    assert data["source"] == "fallback"
    assert "temp_c" in data
    assert "clothing_tips" in data
    assert len(data["clothing_tips"]) > 0


@pytest.mark.asyncio
async def test_weather_mountain_fallback(client):
    resp = await client.get("/api/v1/weather/mountain")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "mountain"
    assert data["source"] == "fallback"
    assert data["temp_c"] < 25


@pytest.mark.asyncio
async def test_weather_city_fallback(client):
    resp = await client.get("/api/v1/weather/city")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "city"
    assert "humidity" in data
    assert "rain_chance" in data


@pytest.mark.asyncio
async def test_weather_abroad_fallback(client):
    resp = await client.get("/api/v1/weather/abroad")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "abroad"
    assert "condition_th" in data


@pytest.mark.asyncio
async def test_weather_ceremony_fallback(client):
    resp = await client.get("/api/v1/weather/ceremony")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "ceremony"


@pytest.mark.asyncio
async def test_weather_unknown_type_defaults_to_city(client):
    resp = await client.get("/api/v1/weather/unknown_type")
    assert resp.status_code == 200
    data = resp.json()
    assert data["destination_type"] == "unknown_type"
    assert data["source"] == "fallback"


@pytest.mark.asyncio
async def test_weather_with_city_param(client):
    resp = await client.get("/api/v1/weather/beach?city=Bali")
    assert resp.status_code == 200
    data = resp.json()
    assert data["source"] == "fallback"


@pytest.mark.asyncio
async def test_weather_response_fields(client):
    resp = await client.get("/api/v1/weather/beach")
    data = resp.json()
    required_fields = [
        "destination_type", "source", "temp_c", "feels_like_c",
        "humidity", "rain_chance", "wind_kph", "condition",
        "condition_th", "icon", "clothing_tips",
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
