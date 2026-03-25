"""
Outfit Models - โมเดลข้อมูล Outfit
============================================

ไฟล์นี้กำหนดโครงสร้างของ 2 ตาราง:
1. outfit_suggestions - Outfit ที่แนะนำสำหรับแต่ละโอกาส
2. saved_outfits - Outfit ที่ผู้ใช้บันทึกไว้
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class OutfitSuggestion(Base):
    """
    Outfit ที่แนะนำ

    เก็บ outfit ที่แนะนำสำหรับ:
    - ประเภทปลายทาง (destination_type)
    - โอกาส (occasion)
    - สภาพอากาศ (weather_condition)

    Attributes:
        id: UUID หลัก
        destination_type: ประเภทปลายทาง (beach/mountain/city/abroad/ceremony)
        occasion: โอกาส (day/night/formal/casual)
        weather_condition: สภาพอากาศ (hot/cold/rainy/etc.)
        description: คำอธิบาย outfit
        image_url: URL รูปภาพ (optional)
        style_tags: แท็กสไตล์ (เช่น ["minimal", "beach"])

    Relationships:
        saved_by: users ที่บันทึก outfit นี้
    """

    __tablename__ = "outfit_suggestions"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    destination_type = Column(String(50), nullable=False)  # beach/mountain/...
    occasion = Column(String(50), nullable=False)  # day/night/formal
    weather_condition = Column(String(50), nullable=True)  # hot/cold/rainy/etc.
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    style_tags = Column(JSONB, default=list)  # ["casual", "minimal"]

    # =========================================================================
    # Relationships
    # =========================================================================
    # cascade="all, delete-orphan" = เมื่อลบ outfit จะลบ saved_outfits ด้วย
    saved_by = relationship("SavedOutfit", back_populates="outfit", cascade="all, delete-orphan")


class SavedOutfit(Base):
    """
    Outfit ที่ผู้ใช้บันทึกไว้

    เก็บ reference ของ outfit ที่ user ชอบและบันทึกไว้

    Attributes:
        id: UUID หลัก
        user_id: UUID ของผู้ใช้ (FK -> users.id)
        outfit_id: UUID ของ outfit (FK -> outfit_suggestions.id)
        saved_at: เวลาที่บันทึก

    Relationships:
        user: เจ้าของ saved outfit
        outfit: outfit ที่บันทึก
    """

    __tablename__ = "saved_outfits"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    outfit_id = Column(
        UUID(as_uuid=True),
        ForeignKey("outfit_suggestions.id", ondelete="CASCADE"),
        nullable=False
    )
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    # =========================================================================
    # Relationships
    # =========================================================================
    user = relationship("User", back_populates="saved_outfits")
    outfit = relationship("OutfitSuggestion", back_populates="saved_by")
