"""
Outfit Models - โมเดลข้อมูล Outfit
============================================
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Uuid, JSON, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class OutfitSuggestion(Base):
    __tablename__ = "outfit_suggestions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    destination_type = Column(String(50), nullable=False)
    occasion = Column(String(50), nullable=False)
    weather_condition = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    style_tags = Column(JSON, default=list)
    gender = Column(String(20), nullable=True, default="unisex")
    season = Column(String(20), nullable=True, default="all_season")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    saved_by = relationship("SavedOutfit", back_populates="outfit", cascade="all, delete-orphan")


class SavedOutfit(Base):
    __tablename__ = "saved_outfits"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    outfit_id = Column(Uuid, ForeignKey("outfit_suggestions.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="saved_outfits")
    outfit = relationship("OutfitSuggestion", back_populates="saved_by")

    __table_args__ = (
        UniqueConstraint("user_id", "outfit_id", name="uq_saved_outfit_user_outfit"),
        Index('ix_saved_outfits_user_id', 'user_id'),
    )
