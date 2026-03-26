"""
Database Configuration
====================

ไฟล์นี้ทำหน้าที่:
- สร้าง async database engine (เชื่อมต่อ PostgreSQL/SQLite)
- สร้าง session factory สำหรับการทำ database operations
- จัดการ database initialization (สร้าง tables)
- ให้ dependency injection สำหรับ database sessions
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

# โหลดการตั้งค่า
settings = get_settings()

# =============================================================================
# Database Engine & Session
# =============================================================================

# แปลง database URL สำหรับ async driver
raw_url = settings.database_url

# Handle PostgreSQL URLs
if raw_url.startswith("postgresql://"):
    db_url = raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif raw_url.startswith("postgresql+asyncpg://"):
    db_url = raw_url  # Already correct format
# Handle SQLite URLs
elif raw_url.startswith("sqlite://"):
    db_url = raw_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
elif raw_url.startswith("sqlite+aiosqlite://"):
    db_url = raw_url  # Already correct format
else:
    db_url = raw_url  # Use as-is for other databases

# สร้าง async engine - เป็นตัวจัดการการเชื่อมต่อ database หลัก
# echo=settings.debug จะแสดง SQL queries ใน console เมื่อ debug mode เปิด
engine = create_async_engine(db_url, echo=settings.debug)

# สร้าง session factory - ใช้สร้าง database sessions สำหรับแต่ละ request
# async_session เป็นตัวสร้าง sessions แบบ async
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,      # ใช้ AsyncSession class
    expire_on_commit=False    # ไม่ expire objects หลัง commit (ให้เข้าถึงได้)
)


# =============================================================================
# Base Model
# =============================================================================
class Base(DeclarativeBase):
    """
    Base class สำหรับ SQLAlchemy models ทั้งหมด

    ทุก model (User, Trip, etc.) จะสืบทอดจาก class นี้
    เพื่อให้ SQLAlchemy รู้ว่าเป็น database model
    """
    pass


# =============================================================================
# Dependency Injection
# =============================================================================
async def get_db() -> AsyncSession:
    """
    Dependency injection สำหรับ database session

    ใช้กับ FastAPI's Depends() เพื่อให้แต่ละ request มี session ของตัวเอง

    Yields:
        AsyncSession: Database session สำหรับการทำ CRUD operations

    Example:
        @router.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            # ใช้ db session ได้เลย
            result = await db.execute(select(User))
            return result.scalars().all()
    """
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()  # ปิด session เมื่อเสร็จ (cleanup)


# =============================================================================
# Database Initialization
# =============================================================================
async def init_db() -> None:
    """
    เริ่มต้น database - สร้าง tables ทั้งหมด

    ทำงาน:
    1. Import models ทั้งหมด (เพื่อให้ Base.metadata รู้จัก)
    2. สร้าง tables ทั้งหมดจาก models (ถ้ายังไม่มี)

    Note: ใช้ run_sync เพราะ create_all เป็น sync function
    """
    # Import models เพื่อ register กับ Base
    import app.models  # noqa: F401

    # สร้าง tables ทั้งหมด
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
