"""
Packing Models - โมเดลข้อมูลการแพ็คของ
===========================================

ไฟล์นี้กำหนดโครงสร้างของ 2 ตาราง:
1. packing_items - รายการสิ่งของที่สามารถนำไปทริป
2. trip_checklists - checklist ของแต่ละทริป

"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class PackingItem(Base):
    """
    รายการสิ่งของสำหรับการแพ็ค

    เก็บข้อมูลสิ่งของทั่วไปที่สามารถนำไปในทริป
    เช่น ร่ม, ครีมกันแดด, ผ้าเช็ดตัว

    Attributes:
        id: UUID หลัก
        name: ชื่อสิ่งของ (เช่น "Sunscreen SPF50")
        category: หมวดหมู่ (essentials/clothing/toiletries/electronics)
        destination_types: ประเภทปลายทางที่แนะนำ (เช่น ["beach", "mountain"])
        is_weather_dependent: ขึ้นกับสภาพอากาศไหม

    Relationships:
        checklists: checklist ที่มี item นี้
    """

    __tablename__ = "packing_items"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # essentials/clothing/toiletries/electronics
    destination_types = Column(JSONB, default=list)  # ["beach", "mountain"]
    is_weather_dependent = Column(Boolean, default=False)

    # =========================================================================
    # Relationships
    # =========================================================================
    checklists = relationship("TripChecklist", back_populates="item")


class TripChecklist(Base):
    """
    Checklist ของแต่ละทริป

    เชื่อมโยงทริปกับ packing items
    และเก็บสถานะว่าแพ็คแล้วหรือยัง

    Attributes:
        id: UUID หลัก
        trip_id: UUID ของทริป (FK -> trips.id)
        item_id: UUID ของ packing item (FK -> packing_items.id, nullable)
        is_packed: แพ็คแล้วหรือยัง
        custom_note: โน้ตเพิ่มเติม (optional)

    Relationships:
        trip: ทริปที่เป็นเจ้าของ checklist นี้
        item: packing item ที่เลือก
    """

    __tablename__ = "trip_checklists"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trip_id = Column(
        UUID(as_uuid=True),
        ForeignKey("trips.id", ondelete="CASCADE"),
        nullable=False
    )
    item_id = Column(UUID(as_uuid=True), ForeignKey("packing_items.id"), nullable=True)
    is_packed = Column(Boolean, default=False)
    custom_note = Column(Text, nullable=True)

    # =========================================================================
    # Relationships
    # =========================================================================
    trip = relationship("Trip", back_populates="checklists")
    item = relationship("PackingItem", back_populates="checklists")
