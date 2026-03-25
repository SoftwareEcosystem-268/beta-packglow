"""
Users Router - API endpoints สำหรับ Users
=========================================

Router นี้จัดการ CRUD operations ของ Users

Endpoints:
- POST /users/      -> สร้าง user ใหม่
- GET /users/       -> ดู users ทั้งหมด
- GET /users/{id}   -> ดู user ตาม ID
- DELETE /users/{id} -> ลบ user

Dependencies:
- database session (get_db)
- User model
- User schemas (UserCreate, UserResponse)
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


# =============================================================================
# POST /users/ - สร้าง user ใหม่
# =============================================================================
@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    สร้าง user ใหม่

    Request body:
        {
            "email": "user@example.com"
        }

    Response:
        {
            "id": "uuid",
            "email": "user@example.com",
            "created_at": "2024-01-15T10:30:00Z"
        }

    Errors:
        400: Email already registered (ถ้า email ซ้ำ)
    """
    # ตรวจสอบว่า email มีอยู่แล้วหรือยัง
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # สร้าง user ใหม่
    user = User(email=user_data.email)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# =============================================================================
# GET /users/ - ดู users ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    """
    ดึง users ทั้งหมด

    Response:
        [
            {
                "id": "uuid",
                "email": "user1@example.com",
                "created_at": "..."
            },
            {
                "id": "uuid",
                "email": "user2@example.com",
                "created_at": "..."
            }
        ]

    Note: ใน production ควรมี pagination
    """
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


# =============================================================================
# GET /users/{user_id} - ดู user ตาม ID
# =============================================================================
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    ดึง user ตาม ID

    Path params:
        user_id: UUID ของ user

    Response:
        {
            "id": "uuid",
            "email": "user@example.com",
            "created_at": "..."
        }

    Errors:
        404: User not found (ถ้า ID ไม่ถูกต้อง)
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# =============================================================================
# DELETE /users/{user_id} - ลบ user
# =============================================================================
@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    ลบ user ตาม ID

    Path params:
        user_id: UUID ของ user ที่ต้องการลบ

    Response:
        204 No Content (ลบสำเร็จ ไม่มี body)

    Errors:
        404: User not found (ถ้า ID ไม่ถูกต้อง)

    Note:
        - cascade delete: จะลบ trips และ saved_outfits ด้วย
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
