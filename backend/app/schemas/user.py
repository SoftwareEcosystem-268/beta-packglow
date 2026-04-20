"""
User Schemas - Pydantic schemas สำหรับ User
============================================

Schemas ใช้สำหรับ:
- Validation: ตรวจสอบข้อมูลที่ส่งเข้ามา
- Serialization: แปลงข้อมูลเป็น JSON เพื่อส่งกลับ
- Documentation: สร้าง OpenAPI docs อัตโนมัติ

การใช้งาน:
    # Create (input)
    user_data = UserCreate(email="test@example.com")

    # Response (output)
    return UserResponse(id=..., email=..., created_at=...)

สาม types หลัก:
- Base: fields ที่ใช้ร่วมกัน
- Create: สำหรับสร้างใหม่ (input)
- Response: สำหรับส่งกลับ (output)
"""

from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    """
    Base schema ของ User

    Attributes:
        name: ชื่อผู้ใช้
        email: อีเมลของผู้ใช้ (validate รูปแบบอัตโนมัติ)
    """
    name: str
    email: EmailStr


class UserCreate(UserBase):
    """
    Schema สำหรับสร้าง user ใหม่ (Register)

    Example:
        {
            "name": "John",
            "email": "user@example.com",
            "password": "yourpassword"
        }
    """
    password: str


class UserLogin(BaseModel):
    """
    Schema สำหรับ login

    Example:
        {
            "email": "user@example.com",
            "password": "yourpassword"
        }
    """
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """
    Schema สำหรับ response ของ user

    Example:
        {
            "id": "uuid",
            "name": "John",
            "email": "user@example.com",
            "created_at": "2024-01-15T10:30:00Z"
        }
    """
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

    # อนุญาตให้แปลงจาก SQLAlchemy model เป็น Pydantic
    # เช่น user_obj = User(email="...") -> UserResponse.model_validate(user_obj)
    model_config = ConfigDict(from_attributes=True)