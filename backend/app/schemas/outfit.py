from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class OutfitSuggestionBase(BaseModel):
    destination_type: str
    occasion: str
    weather_condition: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    style_tags: Optional[List[str]] = []


class OutfitSuggestionResponse(OutfitSuggestionBase):
    id: UUID

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
