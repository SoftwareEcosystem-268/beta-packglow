"""
Trip Schemas - Pydantic schemas สำหรับ Trip
"""

from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from uuid import UUID
from typing import Optional, List, Literal

DestinationType = Literal["beach", "mountain", "city", "abroad", "ceremony"]
TripStatus = Literal["planned", "ongoing", "completed", "cancelled"]


class TripBase(BaseModel):
    destination_type: DestinationType
    duration_days: int
    activities: Optional[List[str]] = []
    start_date: Optional[date] = None


class TripCreate(TripBase):
    user_id: UUID
    title: str = "Untitled Trip"
    destination: Optional[str] = None
    end_date: Optional[date] = None
    status: TripStatus = "planned"


class TripUpdate(BaseModel):
    title: Optional[str] = None
    destination_type: Optional[DestinationType] = None
    destination: Optional[str] = None
    duration_days: Optional[int] = None
    activities: Optional[List[str]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[TripStatus] = None


class TripResponse(TripBase):
    id: UUID
    user_id: UUID
    title: str
    destination: Optional[str] = None
    end_date: Optional[date] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
