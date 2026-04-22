"""Seed outfit_suggestions data"""

import sqlite3
import uuid
import json
from datetime import datetime

conn = sqlite3.connect('packglow.db', timeout=30)
conn.execute("PRAGMA journal_mode=WAL")
cursor = conn.cursor()

# Clear existing data
cursor.execute("DELETE FROM outfit_suggestions")

outfits = [
    # ===== Beach - Day =====
    {
        "destination_type": "beach",
        "occasion": "day",
        "weather_condition": "hot",
        "description": "ชุดสั้นสีพาสเทล + หมวกบักเก็ต + แว่นกันแดด พร้อมลุยทะเลตลอดวัน",
        "image_url": "https://www.sanook.com/women/163817/gallery/",
        "style_tags": ["casual", "minimal"],
        "gender": "female",
        "season": "summer",
    },
    # ===== Beach - Night =====
    {
        "destination_type": "beach",
        "occasion": "night",
        "weather_condition": "hot",
        "description": "เสื้อเชิ้ตลายทาง + กางเกงขาสั้นสีเข้ม ดูดีแต่สบายสำหรับบาร์ริมทะเล",
        "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop",
        "style_tags": ["casual", "elegant"],
        "gender": "unisex",
        "season": "summer",
    },
    # ===== Mountain - Day =====
    {
        "destination_type": "mountain",
        "occasion": "day",
        "weather_condition": "cold",
        "description": "แจ็คเก็ตกันหนาว + เสื้อฮู้ด + กางเกงขายาวเดินป่า พร้อมลุยธรรมชาติ",
        "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=750&fit=crop",
        "style_tags": ["sporty", "outdoor"],
        "gender": "unisex",
        "season": "winter",
    },
    {
        "destination_type": "mountain",
        "occasion": "day",
        "weather_condition": "cold",
        "description": "เสื้อกันหนาวผ้าฟลีซ + กางเกงเดินป่า + รองเท้าเดินป่า เหมาะกับเทร็คกิ้ง",
        "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
        "style_tags": ["sporty", "outdoor"],
        "gender": "male",
        "season": "all_season",
    },
    # ===== City - Day =====
    {
        "destination_type": "city",
        "occasion": "day",
        "weather_condition": "hot",
        "description": "เสื้อยืดคอกลม + กางเกง chinos + รองเท้าผ้าใบ สไตล์เที่ยวเมืองสบายๆ",
        "image_url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=750&fit=crop",
        "style_tags": ["casual", "minimal"],
        "gender": "unisex",
        "season": "all_season",
    },
    # ===== City - Night =====
    {
        "destination_type": "city",
        "occasion": "night",
        "weather_condition": "hot",
        "description": "เสื้อเชิ้ตสีเข้ม + กางเกงตรง + รองเท้าหนัง ดูดีสำหรับดินเนอร์",
        "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=750&fit=crop",
        "style_tags": ["elegant", "minimal"],
        "gender": "unisex",
        "season": "all_season",
    },
    {
        "destination_type": "city",
        "occasion": "night",
        "weather_condition": "cold",
        "description": "เดรสสีเข้ม + เสื้อคลุม + ส้นสูง หรูหราสำหรับงานสังสรรค์ยามค่ำคืน",
        "image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=750&fit=crop",
        "style_tags": ["elegant", "night"],
        "gender": "female",
        "season": "winter",
    },
    # ===== Ceremony =====
    {
        "destination_type": "ceremony",
        "occasion": "formal",
        "weather_condition": "hot",
        "description": "ชุดสูทสีเบจ + เนคไท + รองเท้าหนัง สุภาพเหมาะกับงานพิธี",
        "image_url": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=750&fit=crop",
        "style_tags": ["formal", "elegant"],
        "gender": "male",
        "season": "all_season",
    },
    {
        "destination_type": "ceremony",
        "occasion": "formal",
        "weather_condition": "hot",
        "description": "ชุดเดรสยาวสีโทนอบอุ่น + กระเป๋าคลัทช์ + ส้นสูง สวยงามสำหรับงานพิธี",
        "image_url": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=750&fit=crop",
        "style_tags": ["formal", "elegant"],
        "gender": "female",
        "season": "all_season",
    },
    # ===== Abroad - Day =====
    {
        "destination_type": "abroad",
        "occasion": "day",
        "weather_condition": "variable",
        "description": "เสื้อคาร์ดิแกน + เสื้อยืด + กางเกงยีนส์ เลเยอร์สบายปรับอากาศได้",
        "image_url": "https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600&h=750&fit=crop",
        "style_tags": ["casual", "layering"],
        "gender": "unisex",
        "season": "all_season",
    },
    # ===== Abroad - Night =====
    {
        "destination_type": "abroad",
        "occasion": "night",
        "weather_condition": "cold",
        "description": "เสื้อแจ็คเก็ตหนัง + เสื้อดำ + กางเกงยีนส์ สไตล์สตรีทลุกเที่ยวยามค่ำคืน",
        "image_url": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=750&fit=crop",
        "style_tags": ["street", "night"],
        "gender": "unisex",
        "season": "winter",
    },
    # ===== Beach - Casual =====
    {
        "destination_type": "beach",
        "occasion": "casual",
        "weather_condition": "hot",
        "description": "เสื้อคลุมผ้าบาง + ชุดว่ายน้ำ + กางเกงขาสั้น พร้อมลงเล่นน้ำ",
        "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=750&fit=crop",
        "style_tags": ["casual", "beach"],
        "gender": "unisex",
        "season": "summer",
    },
    # ===== City - Casual =====
    {
        "destination_type": "city",
        "occasion": "casual",
        "weather_condition": "hot",
        "description": "เสื้อโปโล + กางเกงขาสั้น + รองเท้าผ้าใบ สบายเดินเที่ยวตลอดวัน",
        "image_url": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&h=750&fit=crop",
        "style_tags": ["casual", "street"],
        "gender": "male",
        "season": "summer",
    },
]

for outfit in outfits:
    outfit_id = uuid.uuid4().hex
    cursor.execute(
        """INSERT INTO outfit_suggestions
           (id, destination_type, occasion, weather_condition, description, image_url, style_tags, gender, season, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            outfit_id,
            outfit["destination_type"],
            outfit["occasion"],
            outfit["weather_condition"],
            outfit["description"],
            outfit["image_url"],
            json.dumps(outfit["style_tags"]),
            outfit["gender"],
            outfit["season"],
            datetime.now().isoformat(),
        ),
    )

conn.commit()
print(f"Seeded {len(outfits)} outfit suggestions")

cursor.execute("SELECT destination_type, occasion, gender, image_url FROM outfit_suggestions")
for row in cursor.fetchall():
    print(f"  {row[0]:12s} | {row[1]:8s} | {row[2]:7s} | {row[3][:60]}...")
conn.close()
