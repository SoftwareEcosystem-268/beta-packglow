"""
Trip Model - โมเดลข้อมูลทริป
=========================

ไฟล์นี้กำหนดโครงสร้างของตาราง 'trips' ใน database
เก็บข้อมูลทริปการเดินทางของผู้ใช้

Destination Types (ประเภทปลายทาง):
- beach: ชายหาด
- mountain: ภูเขา
- city: เมือง
- abroad: ต่างประเทศ
- ceremony: พิธีการ
"""

from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class Trip(Base):
    """
    โมเดลข้อมูลทริปการเดินทาง

    Attributes:
        id: UUID หลัก (สร้างอัตโนมัติ)
        user_id: UUID ของเจ้าของทริป (FK -> users.id)
        destination_type: ประเภทปลายทาง (beach/mountain/city/abroad/ceremony)
        duration_days: จำนวนวันของทริป
        activities: กิจกรรมที่จะทำ (เก็บเป็น JSON array)
        start_date: วันที่เริ่มทริป (optional)
        created_at: เวลาที่สร้างทริป

    Relationships:
        user: เจ้าของทริป (User ที่เป็นเจ้าของ trip นี้)
        checklists: Packing checklist ของทริปนี้
    """

    __tablename__ = "trips"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    destination_type = Column(String(50), nullable=False)  # beach/mountain/city/abroad/ceremony
    duration_days = Column(Integer, nullable=False)
    activities = Column(JSONB, default=list)  # ["snorkeling", "hiking", "shopping"]
    start_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # =========================================================================
    # Relationships
    # =========================================================================
    user = relationship("User", back_populates="trips")
    checklists = relationship(
        "TripChecklist",
        back_populates="trip",
        cascade="all, delete-orphan"
    )
