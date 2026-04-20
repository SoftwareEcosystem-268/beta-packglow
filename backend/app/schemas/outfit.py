"""
Outfit Schemas - Pydantic schemas สำหรับ Outfit
"""

from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List, Literal

DestinationType = Literal["beach", "mountain", "city", "abroad", "ceremony"]
OutfitOccasion = Literal["day", "night", "formal", "casual"]
OutfitGender = Literal["male", "female", "unisex"]
OutfitSeason = Literal["summer", "winter", "spring", "autumn", "all_season"]


class OutfitSuggestionBase(BaseModel):
    destination_type: DestinationType
    occasion: OutfitOccasion
    weather_condition: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    style_tags: Optional[List[str]] = []


class OutfitSuggestionCreate(OutfitSuggestionBase):
    gender: Optional[OutfitGender] = "unisex"
    season: Optional[OutfitSeason] = "all_season"


class OutfitSuggestionResponse(OutfitSuggestionBase):
    id: UUID
    gender: Optional[str] = "unisex"
    season: Optional[str] = "all_season"
    created_at: datetime

    class Config:
        from_attributes = True


class SavedOutfitCreate(BaseModel):
    outfit_id: UUID


class SavedOutfitResponse(BaseModel):
    id: UUID
    user_id: UUID
    outfit_id: UUID
    saved_at: datetime
    outfit: Optional[OutfitSuggestionResponse] = None

    class Config:
        from_attributes = True
