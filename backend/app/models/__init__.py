"""
Models Package - โมเดลของข้อมูลทั้งหมด
================================

Package นี้รวบรวมโมเดล SQLAlchemy ทั้งหมด
ใช้สำหรับ:
- สร้างตารางใน database
- ทำ mapping ระหว่าง Python objects และ database rows

การ import:
    from app.models import User, Trip, PackingItem

โมเดลทั้งหมด:
- User: ผู้ใช้งานระบบ
- Trip: ทริปการเดินทาง
- PackingItem: รายการสิ่งของสำหรับแพ็ค
- TripChecklist: Checklist ของแต่ละทริป
- OutfitSuggestion: Outfit ที่แนะนำ
- SavedOutfit: Outfit ที่ผู้ใช้บันทึกไว้
- ChecklistTemplate: เทมเพลตรายการแพ็คสำหรับใช้ซ้ำ

Relationship Diagram:
    User 1 -----> * Trip
    User 1 -----> * SavedOutfit
    User 1 -----> * ChecklistTemplate
    Trip 1 -----> * TripChecklist
    PackingItem 1 -----> * TripChecklist
    OutfitSuggestion 1 -----> * SavedOutfit
"""

from app.models.user import User
from app.models.trip import Trip
from app.models.packing import PackingItem, TripChecklist
from app.models.outfit import OutfitSuggestion, SavedOutfit
from app.models.checklist_template import ChecklistTemplate

__all__ = [
    "User",
    "Trip",
    "PackingItem",
    "TripChecklist",
    "OutfitSuggestion",
    "SavedOutfit",
    "ChecklistTemplate",
]
