# 📋 คำสั่งที่ใช้ทุกครั้ง

## 🚀 Development

### Backend (FastAPI)
```bash
cd backend

# ติดตั้ง dependencies
pip install -r requirements.txt

# รัน dev server → http://127.0.0.1:8000
fastapi dev app/main.py

# รัน tests
pytest

# lint
flake8 .
```

### Frontend (Next.js)
```bash
cd frontend

# ติดตั้ง dependencies
npm install

# รัน dev server → http://localhost:3000
npm run dev

# build production
npm run build

# รัน production server
npm run start

# lint
npm run lint
```

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/v1/docs |
| API Docs (ReDoc) | http://localhost:8000/api/v1/redoc |

---

## 📁 Project Structure

```
beta-packglow/
├── backend/
│   ├── app/
│   │   ├── main.py        # Entry point
│   │   ├── config.py      # Settings
│   │   ├── routers/       # API routes
│   │   └── schemas/       # Pydantic models
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── app/               # Next.js App Router
│   ├── lib/
│   │   └── api.ts         # API client
│   ├── public/
│   ├── package.json
│   └── .env.example
│
└── docs/
    └── commands.md        # ไฟล์นี้
```

---

## ⚙️ Environment Variables

### Backend (`.env`)
```env
APP_NAME=Pack&Glow API
DEBUG=true
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.ealdhtqurvqxmnoxgknj.supabase.co:5432/postgres
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🗄️ Database (Supabase)

- **Host**: db.ealdhtqurvqxmnoxgknj.supabase.co
- **Port**: 5432
- **Database**: postgres
- **User**: postgres
- **Password**: [ใส่รหัสผ่านของคุณ]

Tables:
- `users`
- `trips`
- `packing_items`
- `trip_checklists`
- `outfit_suggestions`
- `saved_outfits`

---

## 🔄 Workflow

1. **เริ่มต้นทุกครั้ง:**
   ```bash
   # Terminal 1 - Backend
   cd backend && fastapi dev app/main.py

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **ก่อน commit:**
   ```bash
   # Backend
   cd backend && flake8 . && pytest

   # Frontend
   cd frontend && npm run lint && npm run build
   ```
