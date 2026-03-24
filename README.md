# beta-packglow
แอปที่ช่วยให้การเตรียมตัวเดินทางเป็นเรื่องง่าย โดยแนะนำรายการของที่ควรแพ็ก และไอเดียการแต่งตัวที่เหมาะสมกับจุดหมายปลายทาง

🧳 Pack&Glow
Squad Beta
Tagline
"แพ็กกระเป๋าเป๊ะ แต่งตัวปังทุกทริป"

Product Vision
แอปที่ช่วยให้การเตรียมตัวเดินทางเป็นเรื่องง่าย โดยแนะนำรายการของที่ควรแพ็ก และไอเดียการแต่งตัวที่เหมาะสมกับจุดหมายปลายทาง

Target Users
Persona	คำอธิบาย
Primary	นักศึกษาที่ชอบเที่ยว/ต้องเดินทางบ่อย
Secondary	คนรุ่นใหม่ที่กำลังจะไปงานพิธี/อีเวนต์
User Persona: "พี่แบงค์"
┌─────────────────────────────────────────────────┐
│  👨‍🎓 พี่แบงค์ (Bank)                             │
│  ─────────────────────────────────────────────  │
│  อายุ: 22 ปี                                    │
│  การศึกษา: นักศึกษาปี 4 คณะวิศวกรรมศาสตร์        │
│  งานอดิเรก: เที่ยวกับเพื่อน ถ่ายรูป             │
│                                                 │
│  ความต้องการ:                                   │
│  • อยากรู้ว่าต้องเอาอะไรไปบ้างเวลาเที่ยว        │
│  • อยากแต่งตัวให้เหมาะกับที่ที่จะไป             │
│  • ไม่อยากลืมของสำคัญ                           │
│                                                 │
│  Pain Points:                                   │
│  • แพ็กกระเป๋าแล้วลืมของสำคัญบ่อย               │
│  • ไม่รู้สภาพอากาศที่ปลายทาง                   │
│  • แต่งตัวไม่เหมาะกับกาลเทศะ                    │
└─────────────────────────────────────────────────┘
Problem Statement
นักศึกษาที่เดินทางบ่อยมักประสบปัญหา:

ลืมของสำคัญเวลาแพ็กกระเป๋า
ไม่รู้สภาพอากาศที่ปลายทาง
ไม่แน่ใจว่าควรแต่งตัวแบบไหนให้เหมาะกับสถานที่
Solution
แอป Pack&Glow ให้ผู้ใช้เลือกปลายทางและกิจกรรม แล้วแนะนำรายการของที่ควรแพ็ก พร้อมไอเดียการแต่งตัวที่เหมาะสม

MVP Features (Sprint 1-3)
Feature 1: 🗺️ Destination Picker
User Story:

As a traveler,
I want to select my destination type,
So that I can get relevant packing suggestions.
Acceptance Criteria:

 เลือกประเภทปลายทาง: ทะเล, ภูเขา, เมือง, ต่างประเทศ, งานพิธี
 เลือกจำนวนวันที่เดินทาง
 เลือกกิจกรรมหลักๆ ที่จะทำ
Complexity: Low | Sprint: 1

Feature 2: 🌤️ Weather Integration
User Story:

As a traveler,
I want to know the weather at my destination,
So that I can pack appropriate clothing.
Acceptance Criteria:

 แสดงพยากรณ์อากาศ (Mock API สำหรับ MVP)
 แสดงอุณหภูมิ, โอกาสฝนตก
 แนะนำเครื่องแต่งกายตามสภาพอากาศ
Complexity: Medium | Sprint: 2

Feature 3: 📝 Packing Checklist
User Story:

As a traveler,
I want a personalized packing list,
So that I don't forget important items.
Acceptance Criteria:

 สร้าง checklist ตามปลายทางและกิจกรรม
 tick ✓ ได้เมื่อแพ็กแล้ว
 เพิ่ม/ลบ items ได้ตามต้องการ
 บันทึก checklist ไว้ใช้ซ้ำ
Complexity: Medium | Sprint: 1-2

Feature 4: 👗 Outfit Moodboard
User Story:

As a traveler,
I want outfit suggestions for my trip,
So that I can dress appropriately for each occasion.
Acceptance Criteria:

 แสดงไอเดียการแต่งตัวตามประเภทปลายทาง
 แบ่งตาม occasion (กลางวัน, กลางคืน, งานพิธี)
 แสดงภาพตัวอย่างและคำอธิบาย
 บันทึก outfit ที่ชอบ
Complexity: Medium | Sprint: 3

Technical Architecture
┌─────────────────────────────────────────────────────────────┐
│                    PACK&GLOW ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│   │   Frontend  │────▶│   Backend   │────▶│  Database  │   │
│   │  (React)    │     │ ( FastAPI)  │     │  (SQLite)   │   │
│   │             │     │             │     │             │   │
│   └─────────────┘     └─────────────┘     └─────────────┘   │
│          │                   │                              │
│          │                   ▼                              │
│          │            ┌─────────────┐                       │
│          │            │  Weather    │                       │
│          │            │  API        │                       │
│          │            │  (Mock)     │                       │
│          │            └─────────────┘                       │
│          │                                                  │
└─────────────────────────────────────────────────────────────┘
Data Model (Initial)
Users
├── id (PK)
├── email
└── created_at

Trips
├── id (PK)
├── user_id (FK)
├── destination_type (beach/mountain/city/abroad/ceremony)
├── duration_days
├── activities (JSON array)
├── start_date
└── created_at

PackingItems (Template)
├── id (PK)
├── name
├── category (essentials/clothing/toiletries/electronics)
├── destination_types (JSON array)
└── is_weather_dependent

TripChecklists
├── id (PK)
├── trip_id (FK)
├── item_id (FK)
├── is_packed
└── custom_note

OutfitSuggestions
├── id (PK)
├── destination_type
├── occasion (day/night/formal)
├── weather_condition
├── description
├── image_url
└── style_tags (JSON array)

SavedOutfits
├── id (PK)
├── user_id (FK)
├── outfit_id (FK)
└── saved_at

┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│   Frontend      │  HTTP  │   Backend       │  DB    │   Supabase      │
│   Next.js 16    │ ────▶  │   FastAPI       │ ────▶  │   PostgreSQL    │
│   + Shadcn      │        │   + SQLAlchemy  │        │                 │
└─────────────────┘        └─────────────────┘        └─────────────────┘
   localhost:3000             localhost:8000            Cloud hosted

🚀 คำสั่งเริ่มต้น:

# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
fastapi dev app/main.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev