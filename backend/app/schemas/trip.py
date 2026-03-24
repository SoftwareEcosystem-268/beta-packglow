from pydantic import BaseModel
from datetime import date, datetime
from uuid import UUID
from typing import Optional, List


class TripBase(BaseModel):
    destination_type: str
    duration_days: int
    activities: Optional[List[str]] = []
    start_date: Optional[date] = None


class TripCreate(TripBase):
    user_id: UUID


class TripUpdate(BaseModel):
    destination_type: Optional[str] = None
    duration_days: Optional[int] = None
    activities: Optional[List[str]] = None
    start_date: Optional[date] = None


class TripResponse(TripBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
