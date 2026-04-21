"""
Trips Router - API endpoints สำหรับ Trips
============================================

Router นี้จัดการ CRUD operations ของ Trips

Endpoints:
- POST /trips/           -> สร้าง trip ใหม่
- GET /trips/            -> ดู trips ทั้งหมด (filter ด้วย user_id ได้)
- GET /trips/{trip_id}  -> ดู trip ตาม ID
- PATCH /trips/{trip_id} -> อัพเดท trip (partial update)
- DELETE /trips/{trip_id} -> ลบ trip

Query Parameters:
- user_id: Filter trips โดย user (optional)

Dependencies:
- database session (get_db)
- Trip, User models
- Trip schemas (TripCreate, TripUpdate, TripResponse)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.trip import Trip
from app.models.user import User
from app.schemas.trip import TripCreate, TripUpdate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])


# =============================================================================
# POST /trips/ - สร้าง trip ใหม่
# =============================================================================
@router.post("/", response_model=TripResponse, status_code=201)
async def create_trip(trip_data: TripCreate, db: AsyncSession = Depends(get_db)):
    """
    สร้าง trip ใหม่

    Request body:
        {
            "user_id": "uuid",
            "destination_type": "beach",
            "duration_days": 5,
            "activities": ["swimming", "sunbathing"],
            "start_date": "2024-04-01"
        }

    Response:
        {
            "id": "uuid",
            "user_id": "uuid",
            "destination_type": "beach",
            "duration_days": 5,
            "activities": ["swimming", "sunbathing"],
            "start_date": "2024-04-01",
            "created_at": "..."
        }

    Errors:
        404: User not found (ถ้า user_id ไม่ถูกต้อง)
    """
    # ตรวจสอบว่า user มีอยู่จริง
    result = await db.execute(select(User).where(User.id == trip_data.user_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="User not found")

    # สร้าง trip ใหม่
    trip = Trip(
        user_id=trip_data.user_id,
        title=trip_data.title,
        destination_type=trip_data.destination_type,
        destination=trip_data.destination,
        duration_days=trip_data.duration_days,
        activities=trip_data.activities or [],
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        status=trip_data.status,
    )
    db.add(trip)
    await db.commit()
    await db.refresh(trip)
    return trip


# =============================================================================
# GET /trips/ - ดู trips ทั้งหมด
# =============================================================================
@router.get("/", response_model=List[TripResponse])
async def get_trips(
    user_id: Optional[uuid.UUID] = Query(None, description="Filter trips โดย user ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    ดึง trips ทั้งหมด

    Query params:
        user_id (optional): Filter เฉพาะ trips ของ user นี้

    Response:
        [
            {
                "id": "uuid",
                "user_id": "uuid",
                "destination_type": "beach",
                "duration_days": 5,
                "activities": [...],
                "start_date": "...",
                "created_at": "..."
            },
            ...
        ]

    Examples:
        GET /trips/              -> ดูทุก trips
        GET /trips/?user_id=xxx  -> ดู trips ของ user นั้น
    """
    query = select(Trip)
    if user_id:
        query = query.where(Trip.user_id == user_id)
    result = await db.execute(query)
    trips = result.scalars().all()
    return trips


# =============================================================================
# GET /trips/{trip_id} - ดู trip ตาม ID
# =============================================================================
@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    ดึง trip ตาม ID

    Path params:
        trip_id: UUID ของ trip

    Response:
        {
            "id": "uuid",
            "user_id": "uuid",
            "destination_type": "beach",
            "duration_days": 5,
            "activities": [...],
            "start_date": "...",
            "created_at": "..."
        }

    Errors:
        404: Trip not found (ถ้า ID ไม่ถูกต้อง)
    """
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


# =============================================================================
# PATCH /trips/{trip_id} - อัพเดท trip
# =============================================================================
@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: uuid.UUID,
    trip_data: TripUpdate,
    db: AsyncSession = Depends(get_db)
):
    """
    อัพเดท trip (partial update)

    Path params:
        trip_id: UUID ของ trip

    Request body (ทุก fields optional):
        {
            "duration_days": 7,
            "start_date": "2024-04-15"
        }

    Response:
        {
            "id": "uuid",
            "user_id": "uuid",
            "destination_type": "beach",
            "duration_days": 7,  // updated
            ...
        }

    Errors:
        404: Trip not found (ถ้า ID ไม่ถูกต้อง)
    """
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # อัพเดทเฉพาะ fields ที่ส่งมา
    update_data = trip_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(trip, key, value)

    await db.commit()
    await db.refresh(trip)
    return trip


# =============================================================================
# DELETE /trips/{trip_id} - ลบ trip
# =============================================================================
@router.delete("/{trip_id}", status_code=204)
async def delete_trip(trip_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    ลบ trip ตาม ID

    Path params:
        trip_id: UUID ของ trip ที่ต้องการลบ

    Response:
        204 No Content (ลบสำเร็จ ไม่มี body)

    Errors:
        404: Trip not found (ถ้า ID ไม่ถูกต้อง)

    Note:
        - cascade delete: จะลบ trip_checklists ด้วย
    """
    result = await db.execute(select(Trip).where(Trip.id == trip_id))
    trip = result.scalar_one_or_none()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    await db.delete(trip)
    await db.commit()
