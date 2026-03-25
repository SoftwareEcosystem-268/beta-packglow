"""
Packing Schemas - Pydantic schemas สำหรับการแพ็ค
================================================

Schemas สำหรับจัดการ:
1. PackingItem - รายการสิ่งของที่สามารถนำไปทริป
2. TripChecklist - Checklist ของแต่ละทริป

"""

from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


# =============================================================================
# PackingItem Schemas
# =============================================================================

class PackingItemBase(BaseModel):
    """
    Base schema ของ PackingItem

    Attributes:
        name: ชื่อสิ่งของ (เช่น "Sunscreen SPF50")
        category: หมวดหมู่ (essentials/clothing/toiletries/electronics)
        destination_types: ประเภทปลายทางที่เหมาะ (เช่น ["beach", "mountain"])
        is_weather_dependent: ขึ้นกับสภาพอากาศไหม
    """
    name: str
    category: str
    destination_types: Optional[List[str]] = []
    is_weather_dependent: Optional[bool] = False


class PackingItemCreate(PackingItemBase):
    """
    Schema สำหรับสร้าง packing item ใหม่

    ใช้เป็น request body ของ POST /packing-items/

    Example:
        {
            "name": "Sunscreen SPF50",
            "category": "toiletries",
            "destination_types": ["beach", "abroad"],
            "is_weather_dependent": true
        }
    """
    pass


class PackingItemResponse(PackingItemBase):
    """
    Schema สำหรับ response ของ packing item

    Attributes:
        id: UUID ของ item

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Sunscreen SPF50",
            "category": "toiletries",
            "destination_types": ["beach", "abroad"],
            "is_weather_dependent": true
        }
    """
    id: UUID

    class Config:
        from_attributes = True


# =============================================================================
# TripChecklist Schemas
# =============================================================================

class TripChecklistBase(BaseModel):
    """
    Base schema ของ TripChecklist

    Attributes:
        item_id: UUID ของ packing item (optional - อาจเป็น custom item)
        is_packed: แพ็คแล้วหรือยัง
        custom_note: โน้ตเพิ่มเติม (optional)
    """
    item_id: Optional[UUID] = None
    is_packed: Optional[bool] = False
    custom_note: Optional[str] = None


class TripChecklistCreate(TripChecklistBase):
    """
    Schema สำหรับสร้าง checklist item ใหม่

    Attributes:
        trip_id: UUID ของทริปที่เป็นเจ้าของ

    Example:
        {
            "trip_id": "550e8400-e29b-41d4-a716-446655440001",
            "item_id": "550e8400-e29b-41d4-a716-446655440002",
            "custom_note": "Buy before trip"
        }
    """
    trip_id: UUID


class TripChecklistUpdate(BaseModel):
    """
    Schema สำหรับอัพเดท checklist item

    ใช้เป็น request body ของ PATCH /checklists/{id}

    Example:
        {
            "is_packed": true,
            "custom_note": "Packed in red bag"
        }
    """
    is_packed: Optional[bool] = None
    custom_note: Optional[str] = None


class TripChecklistResponse(TripChecklistBase):
    """
    Schema สำหรับ response ของ checklist item

    Attributes:
        id: UUID ของ checklist item
        trip_id: UUID ของทริป

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "trip_id": "550e8400-e29b-41d4-a716-446655440001",
            "item_id": "550e8400-e29b-41d4-a716-446655440002",
            "is_packed": false,
            "custom_note": "Buy before trip"
        }
    """
    id: UUID
    trip_id: UUID

    class Config:
        from_attributes = True
