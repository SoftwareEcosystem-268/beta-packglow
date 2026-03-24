from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class PackingItem(Base):
    __tablename__ = "packing_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # essentials/clothing/toiletries/electronics
    destination_types = Column(JSONB, default=list)  # ["beach", "mountain"]
    is_weather_dependent = Column(Boolean, default=False)

    # Relationships
    checklists = relationship("TripChecklist", back_populates="item")


class TripChecklist(Base):
    __tablename__ = "trip_checklists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey("packing_items.id"), nullable=True)
    is_packed = Column(Boolean, default=False)
    custom_note = Column(Text, nullable=True)

    # Relationships
    trip = relationship("Trip", back_populates="checklists")
    item = relationship("PackingItem", back_populates="checklists")
