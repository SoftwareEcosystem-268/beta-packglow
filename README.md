# Pack&Glow - Smart Trip Packing & Outfit Planning Platform

A modern full-stack web application that helps travelers plan trips with confidence by combining destination-based packing guidance, outfit inspiration, and trip checklist management.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![CI](https://img.shields.io/badge/GitHub_Actions-CI-blue)

## Product Identity

- Project: 🧳 Pack&Glow
- Team: Squad Beta
- Tagline: "แพ็กกระเป๋าเป๊ะ แต่งตัวปังทุกทริป"

## Product Vision

แอปที่ช่วยให้การเตรียมตัวเดินทางเป็นเรื่องง่าย โดยแนะนำรายการของที่ควรแพ็ก และไอเดียการแต่งตัวที่เหมาะสมกับจุดหมายปลายทาง

## Features

- 🗺️ Destination picker สำหรับเลือกปลายทางและรูปแบบทริป
- 🌤️ Weather-aware planning (ผ่าน mock integration ใน MVP)
- 📝 Packing checklist แบบปรับแต่งได้และติดตามความคืบหน้าได้
- 👗 Outfit moodboard สำหรับแต่งตัวให้เหมาะกับสถานที่และโอกาส
- ✅ Booking summary เพื่อตรวจสอบข้อมูลก่อนยืนยัน
- 📱 Responsive UI รองรับการใช้งานทั้ง desktop และ mobile

## Target Users

| Persona | Description |
|---|---|
| Primary | นักศึกษาที่ชอบเที่ยวและต้องเดินทางบ่อย |
| Secondary | คนรุ่นใหม่ที่กำลังจะไปงานพิธีหรืออีเวนต์ |


## Problem Statement

ผู้ใช้ที่เดินทางบ่อยเจอปัญหาหลัก 3 ข้อ:

- ลืมของสำคัญเวลาแพ็กกระเป๋า
- ไม่แน่ใจสภาพอากาศปลายทาง
- ไม่รู้จะแต่งตัวแบบไหนให้เหมาะกับสถานที่

## Solution

Pack&Glow ช่วยวางแผนก่อนเดินทางตั้งแต่ต้นจนจบ ด้วยการรวม destination planning + packing checklist + outfit suggestions ใน flow เดียว

## Tech Stack

- Frontend: React 19, Next.js 16, TypeScript, Tailwind CSS 4
- Backend: FastAPI, SQLAlchemy, Pydantic Settings
- Database: PostgreSQL (Supabase) และรองรับ SQLite สำหรับ local/test
- Tooling: Pytest, Flake8, ESLint, GitHub Actions CI

## Prerequisites

- Node.js 20+
- Python 3.14
- npm
- pip
- PostgreSQL (แนะนำ Supabase) หรือ SQLite สำหรับ local quick run
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd beta-packglow
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `backend`:

```env
APP_NAME=Pack&Glow API
APP_VERSION=1.0.0
DEBUG=true
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:<PASSWORD>@db.ealdhtqurvqxmnoxgknj.supabase.co:5432/postgres
# local alternative:
# DATABASE_URL=sqlite+aiosqlite:///./packglow.db
```

รัน backend:

```bash
fastapi dev app/main.py
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

รัน frontend:

```bash
npm run dev
```

### 4. Access URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Project Structure

```text
beta-packglow/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   ├── requirements.txt
│   └── tests/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
├── docs/
└── .github/workflows/
```

## API Endpoints

Base URL: `/api/v1`

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Health check (`{"status":"ok"}`) |

### Users

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/users/` | Create user |
| GET | `/api/v1/users/` | List all users |
| GET | `/api/v1/users/{user_id}` | Get user by ID |
| DELETE | `/api/v1/users/{user_id}` | Delete user |

### Trips

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/trips/` | Create trip |
| GET | `/api/v1/trips/` | List trips (optional `user_id` query) |
| GET | `/api/v1/trips/{trip_id}` | Get trip by ID |
| PATCH | `/api/v1/trips/{trip_id}` | Partial update trip |
| DELETE | `/api/v1/trips/{trip_id}` | Delete trip |

## Data Model (Initial)

### Users

```text
id (PK)
email
created_at
```

### Trips

```text
id (PK)
user_id (FK)
destination_type (beach/mountain/city/abroad/ceremony)
duration_days
activities (JSON array)
start_date
created_at
```

### PackingItems (Template)

```text
id (PK)
name
category (essentials/clothing/toiletries/electronics)
destination_types (JSON array)
is_weather_dependent
```

### TripChecklists

```text
id (PK)
trip_id (FK)
item_id (FK)
is_packed
custom_note
```

### OutfitSuggestions

```text
id (PK)
destination_type
occasion (day/night/formal)
weather_condition
description
image_url
style_tags (JSON array)
```

### SavedOutfits

```text
id (PK)
user_id (FK)
outfit_id (FK)
saved_at
```

## Available Commands

### Backend

| Command | Description |
|---|---|
| `cd backend` | Go to backend directory |
| `pip install -r requirements.txt` | Install Python dependencies |
| `fastapi dev app/main.py` | Start backend dev server |
| `pytest` | Run tests |
| `flake8 .` | Run lint |

### Frontend

| Command | Description |
|---|---|
| `cd frontend` | Go to frontend directory |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run lint |

## Environment Variables

### Required Variables

| Variable | Description | Example | Secret? |
|---|---|---|---|
| `DATABASE_URL` | Database connection string for backend | `postgresql://postgres:<PASSWORD>@db.ealdhtqurvqxmnoxgknj.supabase.co:5432/postgres` | Yes ⚠️ |
| `FRONTEND_URL` | Frontend URL for backend CORS allowlist | `http://localhost:3000` | No |
| `API_PREFIX` | API prefix path | `/api/v1` | No |
| `DEBUG` | Backend debug mode | `false` | No |
| `APP_NAME` | API display name | `Pack&Glow API` | No |
| `APP_VERSION` | API version | `1.0.0` | No |
| `NEXT_PUBLIC_API_URL` | Frontend base URL for calling backend | `http://localhost:8000` | No |

### Setting Up .env

```bash
# Backend
cd backend
cp .env.example .env
nano .env

# Frontend
cd ../frontend
cp .env.example .env.local
nano .env.local
```

If `.env.example` does not exist in your local copy, create files manually:

```bash
cd backend && nano .env
cd ../frontend && nano .env.local
```

### ⚠️ Security Rules

- NEVER commit `.env` or `.env.local` to git
- Always keep `.env*` in `.gitignore`
- Use different secrets for dev/staging/production
- Rotate production secrets every 90 days
- If a secret is leaked, revoke and rotate immediately

## CI/CD Pipeline

### Pipeline Overview

```text
Push to main (backend/frontend/workflow changes)
   -> GitHub Actions (CI)
   -> Backend Test + Lint + Build Verification
   -> Frontend Lint + Build + Type Check
   -> Manual Deploy to EC2
```

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
   push:
      branches: [main]
      paths:
         - 'backend/**'
         - 'frontend/**'
         - '.github/workflows/ci.yml'
   pull_request:
      branches: [main]
      paths:
         - 'backend/**'
         - 'frontend/**'
         - '.github/workflows/ci.yml'

jobs:
   backend:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
            with:
               python-version: '3.14'
         - run: pip install -r requirements.txt
         - run: flake8 .
         - run: pytest -v --tb=short

   frontend:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
            with:
               node-version: '20'
         - run: npm ci
         - run: npm run lint
         - run: npm run build
         - run: npx tsc --noEmit
```

### Secrets Required in GitHub

Current pipeline (`ci.yml`) does not require deploy secrets yet.

| Secret Name | Description |
|---|---|
| `EC2_HOST` | Server IP address (for future auto-deploy workflow) |
| `EC2_USER` | SSH username |
| `EC2_KEY` | SSH private key |

## Deployment

### Architecture

```text
User -> Nginx (80/443) -> Frontend (Next.js, 3000)
                                    -> Backend (FastAPI, 8000) -> Supabase PostgreSQL
```

### Server Requirements

- OS: Ubuntu 22.04 LTS
- Runtime: Node.js 20, Python 3.14
- Web Server: Nginx
- Database: PostgreSQL (Supabase)
- RAM: 2GB minimum (4GB recommended)

### Deploy Steps

```bash
# 1. SSH to server
ssh ubuntu@[EC2-IP]

# 2. Pull latest
cd /var/www/beta-packglow && git pull origin main

# 3. Install & Build
cd backend
python3.14 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm ci
npm run build

# 4. Restart
sudo systemctl restart packglow-backend
sudo systemctl restart packglow-frontend
sudo systemctl restart nginx
```

### URLs

- Production: http://[EC2-IP]
- API: http://[EC2-IP]/api/v1

### Manual Deploy (Emergency)

```bash
ssh ubuntu@<EC2-IP>
cd /var/www/beta-packglow
git pull origin main

cd backend
python3.14 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cd ../frontend
npm ci
npm run build

sudo systemctl restart packglow-backend
sudo systemctl restart packglow-frontend
sudo systemctl restart nginx
```

## Contributing

Contributions are welcome. Please create a feature branch and open a pull request with a clear description and testing evidence.

## License

This project is released under the MIT License.

## Support

If you find issues or need help, open an issue in this repository.

---

Built with care by Squad Beta
