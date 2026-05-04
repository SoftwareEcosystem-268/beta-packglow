"""
Test Configuration & Fixtures
============================

Shared fixtures for all tests: test client, DB session, auth helpers.
"""

import os
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

# Force test env before importing app
os.environ["SECRET_KEY"] = "test-secret-key-for-testing-only"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite://"
os.environ["DEBUG"] = "false"

from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402


# In-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite://"
test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """Create tables before each test, drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db

# Disable rate limiting in tests (all requests share IP 127.0.0.1)
app.state.limiter.enabled = False


@pytest_asyncio.fixture
async def client() -> AsyncClient:
    """Async HTTP test client."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_client(client: AsyncClient) -> AsyncClient:
    """Client with a registered+logged-in user, auth header set."""
    resp = await client.post(
        "/api/v1/users/",
        json={"name": "Test User", "email": "test@example.com", "password": "password123"},
    )
    token = resp.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.fixture
def sample_user_data():
    return {"name": "John Doe", "email": "john@example.com", "password": "password123"}


@pytest.fixture
def sample_trip_data():
    return {
        "title": "Beach Vacation",
        "destination_type": "beach",
        "destination": "Phuket",
        "duration_days": 5,
        "activities": ["swimming", "sunbathing"],
        "status": "planned",
    }


@pytest_asyncio.fixture
async def pro_auth_client(client: AsyncClient) -> AsyncClient:
    """Client with a pro-tier user."""
    resp = await client.post(
        "/api/v1/users/",
        json={"name": "Pro User", "email": "pro@example.com", "password": "password123"},
    )
    token = resp.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {token}"
    await client.patch("/api/v1/users/me/tier", json={"tier": "pro", "plan": "monthly"})
    return client


@pytest_asyncio.fixture
async def sample_outfit_id():
    """Insert a sample outfit suggestion and return its ID."""
    from app.models.outfit import OutfitSuggestion
    async with TestSessionLocal() as session:
        outfit = OutfitSuggestion(
            destination_type="beach",
            occasion="day",
            description="Test Beach Outfit",
            style_tags=["casual", "summer"],
        )
        session.add(outfit)
        await session.commit()
        await session.refresh(outfit)
        return str(outfit.id)
