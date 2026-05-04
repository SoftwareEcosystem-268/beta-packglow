"""
User Model - โมเดลข้อมูลผู้ใช้
=========================

ไฟล์นี้กำหนดโครงสร้างของตาราง 'users' ใน database
เก็บข้อมูลผู้ใช้ของระบบ Pack&Glow

"""

from sqlalchemy import Column, String, DateTime, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.database import Base


class User(Base):
    """
    โมเดลข้อมูลผู้ใช้

    Attributes:
        id: UUID หลัก (สร้างอัตโนมัติ)
        email: อีเมลของผู้ใช้ (unique, ไม่ซ้ำกัน)
        created_at: เวลาที่สร้างบัญชี

    Relationships:
        trips: ทริปทั้งหมดของผู้ใช้นี้
        saved_outfits: Outfit ที่บันทึกไว้ทั้งหมด
    """

    __tablename__ = "users"

    # =========================================================================
    # Columns
    # =========================================================================
    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    tier = Column(String(10), nullable=False, default="free")
    subscription_plan = Column(String(10), nullable=True, default=None)
    subscription_expires_at = Column(DateTime(timezone=True), nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # =========================================================================
    # Relationships - ความสัมพันธ์กับตารางอื่น
    # =========================================================================
    # cascade="all, delete-orphan" = เมื่อลบ user จะลบ trips/outfits ด้วย
    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    saved_outfits = relationship("SavedOutfit", back_populates="user", cascade="all, delete-orphan")
