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
    # ===== Beach - Day (female) =====
    {
        "destination_type": "beach",
        "occasion": "day",
        "weather_condition": "hot",
        "description": "ชุดสั้นสีพาสเทล + หมวกบักเก็ต + แว่นกันแดด พร้อมลุยทะเลตลอดวัน",
        "image_url": "https://s.isanook.com/wo/0/ud/32/163817/h2.jpg?ip/resize/w728/q80/jpg",
        "style_tags": ["casual", "minimal"],
        "gender": "female",
        "season": "summer",
    },
    # ===== Beach - Night (unisex) =====
    {
        "destination_type": "beach",
        "occasion": "night",
        "weather_condition": "hot",
        "description": "เสื้อเชิ้ตลายทาง + กางเกงขาสั้นสีเข้ม ดูดีแต่สบายสำหรับบาร์ริมทะเล",
        "image_url": "https://images.unsplash.com/photo-1623886534930-0a71b4068977?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["casual", "elegant"],
        "gender": "unisex",
        "season": "summer",
    },
    # ===== Mountain - Day (unisex) =====
    {
        "destination_type": "mountain",
        "occasion": "day",
        "weather_condition": "cold",
        "description": "แจ็คเก็ตกันหนาว + เสื้อฮู้ด + กางเกงขายาวเดินป่า พร้อมลุยธรรมชาติ",
        "image_url": "https://plus.unsplash.com/premium_photo-1676648534980-773dd0384852?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["sporty", "outdoor"],
        "gender": "unisex",
        "season": "winter",
    },
    # ===== Mountain - Day (male) =====
    {
        "destination_type": "mountain",
        "occasion": "day",
        "weather_condition": "cold",
        "description": "เสื้อกันหนาวผ้าฟลีซ + กางเกงเดินป่า + รองเท้าเดินป่า เหมาะกับเทร็คกิ้ง",
        "image_url": "https://images.unsplash.com/photo-1656983532295-43a9aa707213?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["sporty", "outdoor"],
        "gender": "male",
        "season": "all_season",
    },
    # ===== City - Day (unisex) =====
    {
        "destination_type": "city",
        "occasion": "day",
        "weather_condition": "hot",
        "description": "เสื้อยืดคอกลม + กางเกง chinos + รองเท้าผ้าใบ สไตล์เที่ยวเมืองสบายๆ",
        "image_url": "https://images.unsplash.com/photo-1695234554364-e3944d2c09f8?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["casual", "minimal"],
        "gender": "unisex",
        "season": "all_season",
    },
    # ===== City - Night (unisex) =====
    {
        "destination_type": "city",
        "occasion": "night",
        "weather_condition": "hot",
        "description": "เสื้อเชิ้ตสีเข้ม + กางเกงตรง + รองเท้าหนัง ดูดีสำหรับดินเนอร์",
        "image_url": "https://images.unsplash.com/photo-1645466478772-99f652533d44?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["elegant", "minimal"],
        "gender": "unisex",
        "season": "all_season",
    },
    # ===== City - Night (female) =====
    {
        "destination_type": "city",
        "occasion": "night",
        "weather_condition": "cold",
        "description": "เดรสสีเข้ม + เสื้อคลุม + ส้นสูง หรูหราสำหรับงานสังสรรค์ยามค่ำคืน",
        "image_url": "https://images.unsplash.com/photo-1643103036725-99a45a139b87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["elegant", "night"],
        "gender": "female",
        "season": "winter",
    },
    # ===== Ceremony - Formal (male) =====
    {
        "destination_type": "ceremony",
        "occasion": "formal",
        "weather_condition": "hot",
        "description": "ชุดสูทสีเบจ + เนคไท + รองเท้าหนัง สุภาพเหมาะกับงานพิธี",
        "image_url": "https://images.unsplash.com/photo-1709428590733-164d1334618f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["formal", "elegant"],
        "gender": "male",
        "season": "all_season",
    },
    # ===== Ceremony - Formal (female) =====
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
    # ===== Abroad - Day (unisex) =====
    {
        "destination_type": "abroad",
        "occasion": "day",
        "weather_condition": "variable",
        "description": "เสื้อคาร์ดิแกน + เสื้อยืด + กางเกงยีนส์ เลเยอร์สบายปรับอากาศได้",
        "image_url": "https://images.unsplash.com/photo-1559014305-32424a2b223a?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["casual", "layering"],
        "gender": "unisex",
        "season": "all_season",
    },
    # ===== Abroad - Night (unisex) =====
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
    # ===== Beach - Casual (unisex) =====
    {
        "destination_type": "beach",
        "occasion": "casual",
        "weather_condition": "hot",
        "description": "เสื้อคลุมผ้าบาง + ชุดว่ายน้ำ + กางเกงขาสั้น พร้อมลงเล่นน้ำ",
        "image_url": "https://plus.unsplash.com/premium_photo-1684917942036-62b4089c0c6c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "style_tags": ["casual", "beach"],
        "gender": "unisex",
        "season": "summer",
    },
    # ===== City - Casual (male) =====
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
