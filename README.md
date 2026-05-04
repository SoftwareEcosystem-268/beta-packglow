# Pack&Glow - Smart Trip Packing & Outfit Planning Platform

A modern full-stack web application that helps travelers plan trips with confidence by combining destination-based packing guidance, outfit inspiration, and trip checklist management.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![SQLite](https://img.shields.io/badge/SQLite-aiosqlite-003B57)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)
![Docker](https://img.shields.io/badge/Docker_Compose-deploy-2496ED)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-blue)

## Product Identity

- Project: Pack&Glow
- Team: Squad Beta
- Tagline: "แพ็กกระเป๋าเป๊ะ แต่งตัวปังทุกทริป"

## Product Vision

แอปที่ช่วยให้การเตรียมตัวเดินทางเป็นเรื่องง่าย โดยแนะนำรายการของที่ควรแพ็ก และไอเดียการแต่งตัวที่เหมาะสมกับจุดหมายปลายทาง

## Features

- Destination picker สำหรับเลือกปลายทางและรูปแบบทริป
- Weather-aware planning (OpenWeatherMap integration)
- Packing checklist แบบปรับแต่งได้ พร้อม AI packing suggestions
- Outfit moodboard สำหรับแต่งตัวให้เหมาะกับสถานที่และโอกาส
- AI Chat assistant สำหรับถาม-ตอบเกี่ยวกับการเดินทาง
- Booking summary เพื่อตรวจสอบข้อมูลก่อนยืนยัน
- Pro tier พร้อม PromptPay payment
- Responsive UI รองรับการใช้งานทั้ง desktop และ mobile

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS 4
- **Backend**: FastAPI, SQLAlchemy (async), Pydantic Settings, SlowAPI rate limiting
- **Database**: SQLite (aiosqlite) with Docker volume persistence
- **AI**: OpenRouter API (GPT-4.1-nano) for packing suggestions + chat
- **Weather**: OpenWeatherMap API
- **Auth**: JWT (PyJWT) with bcrypt password hashing
- **Testing**: Pytest (backend), Jest (frontend), Playwright (E2E)
- **CI/CD**: GitHub Actions with Docker Compose deploy to EC2
- **Deployment**: Docker Compose + Nginx reverse proxy

## Prerequisites

- Node.js 20+
- Python 3.14
- npm, pip, Git

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/SoftwareEcosystem-268/beta-packglow.git
cd beta-packglow
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```env
APP_NAME=Pack&Glow API
DEBUG=true
API_PREFIX=/api/v1
DATABASE_URL=sqlite+aiosqlite:///./packglow.db
SECRET_KEY=dev-secret-change-in-production
FRONTEND_URL=http://localhost:3000
OPENWEATHER_API_KEY=your-key
OPENROUTER_API_KEY=your-key
```

Run backend:

```bash
fastapi dev app/main.py
```

### 3. Frontend Setup

```bash
cd ../frontend
npm ci
```

Create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Run frontend:

```bash
npm run dev
```

### 4. Access URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc

## Project Structure

```
beta-packglow/
├── backend/
│   ├── app/
│   │   ├── main.py           # Entry point, CORS, middleware
│   │   ├── config.py         # Pydantic settings
│   │   ├── database.py       # SQLAlchemy async setup
│   │   ├── auth.py           # JWT auth
│   │   ├── rate_limit.py     # Rate limiting config
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic (AI, packing rules)
│   │   └── schemas/          # Pydantic models
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                  # Next.js App Router
│   ├── components/
│   │   ├── sections/         # Page sections
│   │   ├── modals/           # Modal dialogs
│   │   └── *Context.tsx      # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # API client, data
│   ├── e2e/                  # Playwright tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── docs/
│   ├── ARCHITECTURE.md
│   └── commands.md
└── .github/workflows/ci.yml
```

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/users/` | Register |
| POST | `/users/login` | Login |
| GET | `/users/me` | Get current user |
| PATCH | `/users/me/tier` | Update user tier |
| POST | `/trips/` | Create trip |
| GET | `/trips/` | List trips |
| GET | `/trips/{id}` | Get trip |
| PATCH | `/trips/{id}` | Update trip |
| DELETE | `/trips/{id}` | Delete trip |
| GET | `/packing-items/` | List packing items |
| POST | `/checklists/` | Create checklist |
| GET | `/checklists/trip/{id}` | Get trip checklist |
| GET | `/outfit-suggestions/` | List outfits |
| POST | `/saved-outfits/` | Save outfit |
| DELETE | `/saved-outfits/{id}` | Unsave outfit |
| POST | `/packing-assistant/generate` | AI packing suggestions |
| GET | `/weather/{city}` | Get weather |
| POST | `/chat/` | AI chat |
| GET | `/templates/` | List templates |
| POST | `/templates/` | Save template |

## Docker Deployment

### Local

```bash
docker compose up --build -d
docker compose logs -f
docker compose down
```

### Production (CI/CD)

Push to `main` branch triggers GitHub Actions:

1. Backend CI: lint + test + coverage (70%+)
2. Frontend CI: lint + test + build + E2E
3. Deploy: SSH to EC2, Docker Compose build + run, Nginx reload

**Production URL**: `http://labs89.hpc-ignite.org:8080/beta-packglow`

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 public IP |
| `EC2_USER` | SSH user (ubuntu) |
| `EC2_SSH_KEY` | SSH private key |
| `SECRET_KEY` | JWT signing key (`openssl rand -hex 32`) |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `OPENROUTER_API_KEY` | OpenRouter AI API key |

## Security

- JWT secret loaded from environment variable (no hardcoded secrets)
- bcrypt password hashing
- Rate limiting on API endpoints (SlowAPI)
- CORS configured for specific origins
- Input validation via Pydantic schemas
- SQL injection protection via SQLAlchemy ORM

## Testing

```bash
# Backend
cd backend && pytest -v --cov=app

# Frontend unit
cd frontend && npm test

# Frontend E2E
cd frontend && npm run test:e2e
```

## Contributing

Contributions are welcome. Please create a feature branch and open a pull request with a clear description and testing evidence.

## License

MIT License

---

Built by Squad Beta
