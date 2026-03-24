from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class PackingItemBase(BaseModel):
    name: str
    category: str
    destination_types: Optional[List[str]] = []
    is_weather_dependent: Optional[bool] = False


class PackingItemCreate(PackingItemBase):
    pass


class PackingItemResponse(PackingItemBase):
    id: UUID

    class Config:
        from_attributes = True


class TripChecklistBase(BaseModel):
    item_id: Optional[UUID] = None
    is_packed: Optional[bool] = False
    custom_note: Optional[str] = None


class TripChecklistCreate(TripChecklistBase):
    trip_id: UUID


class TripChecklistUpdate(BaseModel):
    is_packed: Optional[bool] = None
    custom_note: Optional[str] = None


class TripChecklistResponse(TripChecklistBase):
    id: UUID
    trip_id: UUID

    class Config:
        from_attributes = True
