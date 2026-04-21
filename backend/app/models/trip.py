"""
Trip Model - โมเดลข้อมูลทริป
=========================
"""

from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey, Uuid, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, default="Untitled Trip")
    destination_type = Column(String(50), nullable=False)
    destination = Column(String(255), nullable=True)
    duration_days = Column(Integer, nullable=False)
    activities = Column(JSON, default=list)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(20), nullable=False, default="planned")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="trips")
    checklists = relationship("TripChecklist", back_populates="trip", cascade="all, delete-orphan")

    __table_args__ = (
        Index('ix_trips_user_id', 'user_id'),
    )
