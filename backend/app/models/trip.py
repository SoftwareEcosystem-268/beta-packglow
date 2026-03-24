from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    destination_type = Column(String(50), nullable=False)  # beach/mountain/city/abroad/ceremony
    duration_days = Column(Integer, nullable=False)
    activities = Column(JSONB, default=list)  # ["snorkeling", "hiking", "shopping"]
    start_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="trips")
    checklists = relationship("TripChecklist", back_populates="trip", cascade="all, delete-orphan")
