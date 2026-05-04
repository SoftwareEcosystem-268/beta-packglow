# Commands Reference

## Development

### Backend (FastAPI)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run dev server → http://127.0.0.1:8000
fastapi dev app/main.py

# Run tests
pytest -v --tb=short --cov=app

# Lint
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
flake8 . --count --max-complexity=10 --max-line-length=127 --statistics
```

### Frontend (Next.js)
```bash
cd frontend

# Install dependencies
npm ci

# Run dev server → http://localhost:3000
npm run dev

# Build production
npm run build

# Run production server
npm run start

# Lint
npm run lint

# Unit tests
npm test

# E2E tests (requires running dev server)
npm run test:e2e
```

---

## URLs

### Local Development
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/api/v1/docs |
| API Docs (ReDoc) | http://localhost:8000/api/v1/redoc |

### Production
| Service | URL |
|---------|-----|
| Frontend | http://labs89.hpc-ignite.org:8080/beta-packglow |
| Backend API | http://labs89.hpc-ignite.org:8080/beta-packglow/api/v1 |
| API Docs | http://labs89.hpc-ignite.org:8080/beta-packglow/api/v1/docs |

---

## Project Structure

```
beta-packglow/
├── backend/
│   ├── app/
│   │   ├── main.py           # Entry point, CORS, middleware
│   │   ├── config.py         # Pydantic settings from env
│   │   ├── database.py       # SQLAlchemy async setup
│   │   ├── auth.py           # JWT token creation/validation
│   │   ├── rate_limit.py     # SlowAPI rate limiting
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routers/          # API endpoint handlers
│   │   ├── services/         # Business logic (AI, packing rules)
│   │   └── schemas/          # Pydantic request/response models
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── app/                  # Next.js App Router pages
│   ├── components/
│   │   ├── sections/         # Page sections (HomeNavbar, HeroSection, etc.)
│   │   ├── modals/           # Modal dialogs (Toast, LoginAlertModal, etc.)
│   │   ├── AuthContext.tsx    # Auth provider
│   │   ├── TripContext.tsx    # Trip state provider
│   │   ├── OutfitContext.tsx  # Outfit state provider
│   │   └── PackingContext.tsx # Packing state provider
│   ├── hooks/
│   │   └── usePageState.ts   # Shared homepage state
│   ├── lib/
│   │   ├── api.ts            # API client with retry
│   │   └── data/             # Static config (destinations, categories)
│   ├── e2e/                  # Playwright E2E tests
│   ├── Dockerfile
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md       # System architecture diagrams
│   └── commands.md           # This file
│
├── docker-compose.yml        # Docker Compose for deployment
└── .github/workflows/ci.yml  # CI/CD pipeline
```

---

## Environment Variables

### Backend (`backend/.env`)
```env
APP_NAME=Pack&Glow API
APP_VERSION=1.0.0
DEBUG=false
API_PREFIX=/api/v1
DATABASE_URL=sqlite+aiosqlite:///./packglow.db
SECRET_KEY=<generate with: openssl rand -hex 32>
FRONTEND_URL=http://localhost:3000
OPENWEATHER_API_KEY=<from openweathermap.org>
OPENROUTER_API_KEY=<from openrouter.ai>
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-4.1-nano
OPENROUTER_WEB_SEARCH=true
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Production (Docker)
```env
DATABASE_URL=sqlite+aiosqlite:////app/data/packglow.db
NEXT_PUBLIC_API_URL=http://labs89.hpc-ignite.org:8080/beta-packglow/api/v1
NEXT_BASE_PATH=/beta-packglow
```

---

## Database (SQLite)

- **Engine**: SQLite via aiosqlite (async)
- **File**: `backend/packglow.db` (local) or `/app/data/packglow.db` (Docker)
- **Docker volume**: `packglow_data` — persists across container restarts

Tables:
- `users`
- `trips`
- `packing_items`
- `trip_checklists`
- `outfit_suggestions`
- `saved_outfits`
- `checklist_templates`

---

## Docker Deployment

```bash
# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove volumes (WARNING: deletes database)
docker compose down -v
```

---

## GitHub Secrets (CI/CD)

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 public IP (3.24.165.167) |
| `EC2_USER` | SSH user (ubuntu) |
| `EC2_SSH_KEY` | SSH private key |
| `SECRET_KEY` | JWT signing key |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `OPENROUTER_API_KEY` | OpenRouter AI API key |

---

## Nginx on EC2

```
/etc/nginx/sites-enabled/
  alpha           # Friend's project (port 80, PM2)
  default         # Nginx default page (port 80)
  beta-packglow   # Our project (port 8080, Docker)
```

---

## Workflow

1. **Start developing:**
   ```bash
   # Terminal 1 - Backend
   cd backend && fastapi dev app/main.py

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Before commit:**
   ```bash
   # Backend
   cd backend && flake8 . && pytest -v

   # Frontend
   cd frontend && npm run lint && npm run build
   ```

3. **Deploy:**
   ```bash
   git push origin main    # GitHub Actions handles the rest
   ```
