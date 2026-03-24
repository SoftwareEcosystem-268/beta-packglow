from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class OutfitSuggestion(Base):
    __tablename__ = "outfit_suggestions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_type = Column(String(50), nullable=False)  # beach/mountain/...
    occasion = Column(String(50), nullable=False)  # day/night/formal
    weather_condition = Column(String(50), nullable=True)  # hot/cold/rainy/etc
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    style_tags = Column(JSONB, default=list)  # ["casual", "minimal"]

    # Relationships
    saved_by = relationship("SavedOutfit", back_populates="outfit", cascade="all, delete-orphan")


class SavedOutfit(Base):
    __tablename__ = "saved_outfits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    outfit_id = Column(UUID(as_uuid=True), ForeignKey("outfit_suggestions.id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="saved_outfits")
    outfit = relationship("OutfitSuggestion", back_populates="saved_by")
