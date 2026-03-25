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

from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    """
    Base schema ของ User

    ประกอบด้วย fields ที่ใช้ร่วมกันใน create และ response

    Attributes:
        email: อีเมลของผู้ใช้ (validate รูปแบบอัตโนมัติ)
    """
    email: EmailStr


class UserCreate(UserBase):
    """
    Schema สำหรับสร้าง user ใหม่

    ใช้เป็น request body ของ POST /users/

    สืบทอดจาก UserBase (มี email อยู่แล้ว)
    ถ้าต้องการเพิ่ม fields อื่นๆ เช่น password, ให้เพิ่มที่นี่

    Example:
        {
            "email": "user@example.com"
        }
    """
    pass


class UserResponse(UserBase):
    """
    Schema สำหรับ response ของ user

    ใช้เป็น response model ของ GET/POST /users/

    Attributes:
        id: UUID ของ user
        email: อีเมล (สืบทอดจาก UserBase)
        created_at: เวลาที่สร้างบัญชี

    Example:
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "user@example.com",
            "created_at": "2024-01-15T10:30:00Z"
        }
    """
    id: UUID
    created_at: datetime

    class Config:
        # อนุญาตให้แปลงจาก SQLAlchemy model เป็น Pydantic
        # เช่น user_obj = User(email="...") -> UserResponse.model_validate(user_obj)
        from_attributes = True
