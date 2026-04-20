"""
Packing Models - โมเดลข้อมูลการแพ็คของ
===========================================
"""

from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Text, Uuid, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class PackingItem(Base):
    __tablename__ = "packing_items"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    destination_types = Column(JSON, default=list)
    is_weather_dependent = Column(Boolean, default=False)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=True)

    checklists = relationship("TripChecklist", back_populates="item")
    owner = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index('ix_packing_items_user_id', 'user_id'),
    )


class TripChecklist(Base):
    __tablename__ = "trip_checklists"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    trip_id = Column(Uuid, ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Uuid, ForeignKey("packing_items.id"), nullable=True)
    is_packed = Column(Boolean, default=False)
    custom_note = Column(Text, nullable=True)
    quantity = Column(Integer, default=1)
    custom_item_name = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)

    trip = relationship("Trip", back_populates="checklists")
    item = relationship("PackingItem", back_populates="checklists")

    __table_args__ = (
        Index('ix_trip_checklists_trip_id', 'trip_id'),
    )
