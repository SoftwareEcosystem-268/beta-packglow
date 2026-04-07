"""
Trip Schemas - Pydantic schemas สำหรับ Trip
============================================

Schemas สำหรับจัดการข้อมูลทริปการเดินทาง

Destination Types (ประเภทปลายทาง):
- beach: ชายหาด
- mountain: ภูเขา
- city: เมือง
- abroad: ต่างประเทศ
- ceremony: พิธีการ
"""

from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from uuid import UUID
from typing import Optional, List


class TripBase(BaseModel):
    """
    Base schema ของ Trip

    Attributes:
        destination_type: ประเภทปลายทาง (beach/mountain/city/abroad/ceremony)
        duration_days: จำนวนวันของทริป
        activities: กิจกรรมที่จะทำ (optional)
        start_date: วันที่เริ่มทริป (optional)
    """
    destination_type: str
    duration_days: int
    activities: Optional[List[str]] = []
    start_date: Optional[date] = None


class TripCreate(TripBase):
    """
    Schema สำหรับสร้างทริปใหม่

    ใช้เป็น request body ของ POST /trips/

    Attributes:
        user_id: UUID ของเจ้าของทริป (required)

    Example:
        {
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "destination_type": "beach",
            "duration_days": 5,
            "activities": ["swimming", "sunbathing"],
            "start_date": "2024-04-01"
        }
    """
    user_id: UUID


class TripUpdate(BaseModel):
    """
    Schema สำหรับอัพเดททริป

    ใช้เป็น request body ของ PATCH /trips/{id}
    ทุก fields เป็น optional (สามารถอัพเดทเฉพาะบาง fields)

    Example:
        {
            "duration_days": 7,
            "start_date": "2024-04-15"
        }
    """
    destination_type: Optional[str] = None
    duration_days: Optional[int] = None
    activities: Optional[List[str]] = None
    start_date: Optional[date] = None


class TripResponse(TripBase):
    """
    Schema สำหรับ response ของทริป

    ใช้เป็น response model ของ GET /trips/

    Attributes:
        id: UUID ของทริป
        user_id: UUID ของเจ้าของทริป
        destination_type: ประเภทปลายทาง (สืบทอด)
        duration_days: จำนวนวัน (สืบทอด)
        activities: กิจกรรม (สืบทอด)
        start_date: วันที่เริ่ม (สืบทอด)
        created_at: เวลาที่สร้างทริป

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "destination_type": "beach",
            "duration_days": 5,
            "activities": ["swimming", "sunbathing"],
            "start_date": "2024-04-01",
            "created_at": "2024-01-15T10:30:00Z"
        }
    """
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
