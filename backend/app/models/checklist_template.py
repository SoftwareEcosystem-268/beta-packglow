"""
ChecklistTemplate Model - เทมเพลตรายการแพ็คสำหรับใช้ซ้ำ
======================================================
"""

from sqlalchemy import Column, String, DateTime, ForeignKey, Uuid, JSON, Index
from sqlalchemy.sql import func
import uuid

from app.database import Base


class ChecklistTemplate(Base):
    __tablename__ = "checklist_templates"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    items = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        Index('ix_checklist_templates_user_id', 'user_id'),
    )
