"""
User Schemas - Pydantic schemas สำหรับ User
"""

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator
from datetime import datetime
from typing import Optional
from uuid import UUID


class UserBase(BaseModel):
    name: str
    email: EmailStr

    @field_validator("name")
    @classmethod
    def name_must_not_be_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Name is required")
        if len(v) > 100:
            raise ValueError("Name must be at most 100 characters")
        return v


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        if len(v) > 128:
            raise ValueError("Password must be at most 128 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID
    tier: str = "free"
    subscription_plan: Optional[str] = None
    subscription_expires_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TierUpdate(BaseModel):
    tier: str
    plan: Optional[str] = None
