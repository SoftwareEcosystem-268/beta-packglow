"""
Outfit Schemas - Pydantic schemas สำหรับ Outfit
=============================================

Schemas สำหรับจัดการ outfit recommendations และ saved outfits

Outfit Categories:
- destination_type: beach/mountain/city/abroad/ceremony
- occasion: day/night/formal/casual
- weather_condition: hot/cold/rainy/etc.
"""

from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


# =============================================================================
# OutfitSuggestion Schemas
# =============================================================================

class OutfitSuggestionBase(BaseModel):
    """
    Base schema ของ OutfitSuggestion

    Attributes:
        destination_type: ประเภทปลายทาง (beach/mountain/city/abroad/ceremony)
        occasion: โอกาส (day/night/formal/casual)
        weather_condition: สภาพอากาศ (optional)
        description: คำอธิบาย outfit (optional)
        image_url: URL รูปภาพ (optional)
        style_tags: แท็กสไตล์์ (optional)
    """
    destination_type: str
    occasion: str
    weather_condition: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    style_tags: Optional[List[str]] = []


class OutfitSuggestionCreate(OutfitSuggestionBase):
    """
    Schema สำหรับสร้าง outfit suggestion ใหม่

    ใช้เป็น request body ของ POST /outfits/

    สืบทอดจาก OutfitSuggestionBase

    Example:
        {
            "destination_type": "beach",
            "occasion": "day",
            "weather_condition": "hot",
            "description": "Light summer dress with hat",
            "image_url": "https://example.com/outfit.jpg",
            "style_tags": ["casual", "minimal", "beach"]
        }
    """
    pass


    pass


class OutfitSuggestionResponse(OutfitSuggestionBase):
    """
    Schema สำหรับ response ของ outfit suggestion

    ใช้เป็น response model ของ GET /outfits/

    Attributes:
        id: UUID ของ outfit (จาก database)
        destination_type: ประเภทปลายทาง (สืบทอด)
        occasion: โอกาส (สืบทอด)
        weather_condition: สภาพอากาศ (สืบทอด)
        description: คำอธิบาย (สืบทอด)
        image_url: URL รูป (สืบทอด)
        style_tags: แท็กสไตล์์ (สืบทอด)

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440003",
            "destination_type": "beach",
            "occasion": "day",
            "weather_condition": "hot",
            "description": "Light summer dress with hat",
            "image_url": "https://example.com/outfit.jpg",
            "style_tags": ["casual", "minimal", "beach"],
            "created_at": "2024-01-15T10:30:00Z"
        }
    """
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# =============================================================================
# SavedOutfit Schemas
# =============================================================================

class SavedOutfitCreate(BaseModel):
    """
    Schema สำหรับบันทึก outfit

    ใช้เป็น request body ของ POST /saved-outfits/

    Attributes:
        outfit_id: UUID ของ outfit ที่ต้องการบันทึก

    Example:
        {
            "outfit_id": "550e8400-e29b-41d4-a716-446655440003"
        }
    """
    outfit_id: UUID


class SavedOutfitResponse(BaseModel):
    """
    Schema สำหรับ response ของ saved outfit

    ใช้เป็น response model ของ GET /saved-outfits/

    Attributes:
        id: UUID ของ saved outfit record
        user_id: UUID ของผู้ใช้ที่บันทึก
        outfit_id: UUID ของ outfit ที่บันทึก
        saved_at: เวลาที่บันทึก
        outfit: ข้อมูล outfit ที่บันทึก (nested)

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440004",
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "outfit_id": "550e8400-e29b-41d4-a716-446655440003",
            "saved_at": "2024-01-15T10:30:00Z",
            "outfit": {
                "id": "550e8400-e29b-41d4-a716-446655440003",
                "destination_type": "beach",
                "occasion": "day",
                ...
            }
        }
    """
    id: UUID
    user_id: UUID
    outfit_id: UUID
    saved_at: datetime
    outfit: Optional[OutfitSuggestionResponse] = None

    class Config:
        from_attributes = True
