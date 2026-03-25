"""
Schemas Package - Pydantic schemas ทั้งหมด
======================================

Package นี้รวบรวม Pydantic schemas ทั้งหมด

Schemas คือ data transfer objects (DTOs)
ใช้สำหรับ:
- Validation: ตรวจสอบข้อมูลที่ส่งเข้ามา
- Serialization: แปลงข้อมูลเป็น JSON
- Documentation: สร้าง OpenAPI docs อัตโนมัติ

การใช้งาน:
    # Request body (input)
    user_data = UserCreate(email="test@example.com")

    # Response body (output)
    return UserResponse(id=..., email=..., created_at=...)

Convention:
- *Base: fields ที่ใช้ร่วมกัน
- *Create: สำหรับสร้างใหม่ (input)
- *Update: สำหรับอัพเดท (input, partial update)
- *Response: สำหรับส่งกลับ (output)
"""

from app.schemas.user import UserBase, UserCreate, UserResponse
from app.schemas.trip import TripBase, TripCreate, TripUpdate, TripResponse
from app.schemas.packing import (
    PackingItemBase,
    PackingItemCreate,
    PackingItemResponse,
    TripChecklistBase,
    TripChecklistCreate,
    TripChecklistUpdate,
    TripChecklistResponse,
)
from app.schemas.outfit import (
    OutfitSuggestionBase,
    OutfitSuggestionCreate,
    OutfitSuggestionResponse,
    SavedOutfitCreate,
    SavedOutfitResponse,
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "UserResponse",
    # Trip schemas
    "TripBase",
    "TripCreate",
    "TripUpdate",
    "TripResponse",
    # Packing schemas
    "PackingItemBase",
    "PackingItemCreate",
    "PackingItemResponse",
    "TripChecklistBase",
    "TripChecklistCreate",
    "TripChecklistUpdate",
    "TripChecklistResponse",
    # Outfit schemas
    "OutfitSuggestionBase",
    "OutfitSuggestionCreate",
    "OutfitSuggestionResponse",
    "SavedOutfitCreate",
    "SavedOutfitResponse",
]
