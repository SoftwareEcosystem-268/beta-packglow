"""
Packing Schemas - Pydantic schemas สำหรับการแพ็ค
"""

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, List, Literal

PackingCategory = Literal["clothes", "personal", "health", "electronics", "documents", "others"]


class PackingItemBase(BaseModel):
    name: str
    category: PackingCategory
    destination_types: Optional[List[str]] = []
    is_weather_dependent: Optional[bool] = False


class PackingItemCreate(PackingItemBase):
    user_id: Optional[UUID] = None


class PackingItemResponse(PackingItemBase):
    id: UUID
    user_id: Optional[UUID] = None

    model_config = ConfigDict(from_attributes=True)


class TripChecklistBase(BaseModel):
    item_id: Optional[UUID] = None
    is_packed: Optional[bool] = False
    custom_note: Optional[str] = None
    quantity: Optional[int] = 1
    custom_item_name: Optional[str] = None
    sort_order: Optional[int] = 0


class TripChecklistCreate(TripChecklistBase):
    trip_id: UUID


class TripChecklistUpdate(BaseModel):
    is_packed: Optional[bool] = None
    custom_note: Optional[str] = None
    quantity: Optional[int] = None
    custom_item_name: Optional[str] = None
    sort_order: Optional[int] = None


class TripChecklistResponse(TripChecklistBase):
    id: UUID
    trip_id: UUID

    model_config = ConfigDict(from_attributes=True)

class BulkChecklistItem(BaseModel):
    id: Optional[UUID] = None
    item_id: Optional[UUID] = None
    is_packed: Optional[bool] = False
    custom_note: Optional[str] = None
    quantity: Optional[int] = 1
    custom_item_name: Optional[str] = None
    sort_order: Optional[int] = 0


class BulkChecklistRequest(BaseModel):
    items: List[BulkChecklistItem]