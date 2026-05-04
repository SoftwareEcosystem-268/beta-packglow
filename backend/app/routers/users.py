"""
Users Router - API endpoints สำหรับ Users
=========================================

Router นี้จัดการ CRUD operations ของ Users

Endpoints:
- POST /users/      -> สร้าง user ใหม่ (signup)
- POST /users/login -> เข้าสู่ระบบ (login)
- GET /users/me     -> ดู profile ของ user ที่ login อยู่
- GET /users/       -> ดู users ทั้งหมด
- GET /users/{id}   -> ดู user ตาม ID
- DELETE /users/{id} -> ลบ user

Dependencies:
- database session (get_db)
- User model
- User schemas (UserCreate, UserLogin, UserResponse, LoginResponse)
- auth module (create_access_token, get_current_user)
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timedelta, timezone
import uuid
import bcrypt

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, LoginResponse, TierUpdate
from app.auth import create_access_token, get_current_user
from app.rate_limit import limiter

router = APIRouter(prefix="/users", tags=["Users"])


async def check_subscription(user: User, db: AsyncSession) -> User:
    """ตรวจสอบและ downgrad subscription ที่หมดอายุ"""
    if user.tier == "pro" and user.subscription_expires_at:
        expires = user.subscription_expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if datetime.now(timezone.utc) > expires:
            user.tier = "free"
            user.subscription_plan = None
            user.subscription_expires_at = None
            await db.commit()
            await db.refresh(user)
    return user


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


# =============================================================================
# POST /users/ - สร้าง user ใหม่ (signup)
# =============================================================================
@router.post("/", response_model=LoginResponse, status_code=201)
@limiter.limit("5/minute")
async def create_user(request: Request, user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # ตรวจสอบว่า email มีอยู่แล้วหรือยัง
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # สร้าง user ใหม่
    user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({"sub": str(user.id), "tier": user.tier})
    return LoginResponse(access_token=token, user=user)


# =============================================================================
# POST /users/login - เข้าสู่ระบบ
# =============================================================================
@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login_user(request: Request, login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง")

    if not bcrypt.checkpw(login_data.password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="อีเมลหรือรหัสผ่านไม่ถูกต้อง")

    user = await check_subscription(user, db)
    token = create_access_token({"sub": str(user.id), "tier": user.tier})
    return LoginResponse(access_token=token, user=user)


# =============================================================================
# GET /users/me - ดู profile ของ user ที่ login อยู่
# =============================================================================
@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await check_subscription(current_user, db)


# =============================================================================
# GET /users/ - ดู users ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


# =============================================================================
# GET /users/{user_id} - ดู user ตาม ID
# =============================================================================
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# =============================================================================
# DELETE /users/{user_id} - ลบ user
# =============================================================================
@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()


# =============================================================================
# PATCH /users/me/tier - อัปเกรด tier พร้อม subscription plan
# =============================================================================
@router.patch("/me/tier", response_model=UserResponse)
async def update_tier(
    tier_data: TierUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    new_tier = tier_data.tier
    plan = tier_data.plan

    if new_tier not in ("free", "pro"):
        raise HTTPException(status_code=400, detail="Tier must be 'free' or 'pro'")

    if new_tier == "free":
        current_user.tier = "free"
        current_user.subscription_plan = None
        current_user.subscription_expires_at = None
    elif new_tier == "pro":
        if plan not in ("monthly", "yearly"):
            raise HTTPException(status_code=400, detail="Plan must be 'monthly' or 'yearly'")
        current_user.tier = "pro"
        current_user.subscription_plan = plan
        now = datetime.now(timezone.utc)
        if plan == "monthly":
            current_user.subscription_expires_at = now + timedelta(days=30)
        else:
            current_user.subscription_expires_at = now + timedelta(days=365)

    await db.commit()
    await db.refresh(current_user)
    return current_user
