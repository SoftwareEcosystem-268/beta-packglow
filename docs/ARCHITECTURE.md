# Pack&Glow Architecture

## System Overview

```mermaid
graph LR
    Browser[Browser] --> Nginx[Nginx :8080]
    Nginx --> NextJS[Next.js Frontend :3002]
    Nginx --> FastAPI[FastAPI Backend :8000]
    FastAPI --> SQLite[(SQLite + Docker Volume)]
    FastAPI --> OpenRouter[OpenRouter AI API]
    FastAPI --> OWM[OpenWeatherMap API]
```

## Frontend Architecture

```mermaid
graph TD
    RootLayout[RootLayout] --> Providers
    Providers --> AuthProvider[AuthContext]
    AuthProvider --> TripProvider[TripContext]
    TripProvider --> OutfitProvider[OutfitContext]
    OutfitProvider --> PackingProvider[PackingContext]
    PackingProvider --> Page[page.tsx - Orchestrator]

    Page --> HomeNavbar
    Page --> HeroSection
    Page --> DestinationsSection
    Page --> PackingSection
    Page --> ProFeaturesPreview
    Page --> OutfitsSection
    Page --> BookingsSection
    Page --> PricingSection
    Page --> FooterSection

    Page --> Toast
    Page --> LoginAlertModal
    Page --> TemplateSaveModal
    Page --> ProUpgradePopup

    PackingSection --> TemplateSaveModal
    BookingsSection --> CancelBookingModal
    DestinationsSection --> DestinationPackingModal
    OutfitsSection --> OutfitDetailModal
```

### Data Flow

- **AuthContext** — localStorage-backed user state (JWT token, user info, tier)
- **TripContext** — fetches trips from API, persists currentTrip to localStorage
- **OutfitContext** — fetches outfits + saved outfits from API
- **PackingContext** — manages packing items, checklists, templates, AI generation
- **usePageState** — shared page state (isPro, toast, template handlers, scrollTo)
- **lib/data/** — static configuration (destinations, categories, pricing, booking helpers)

## Backend Architecture

```mermaid
graph TD
    App[FastAPI App] --> CORS[CORS Middleware]
    App --> RateLimit[SlowAPI Rate Limiting]
    App --> ReqLog[Request Logging]

    App --> Routers
    Routers --> Health[/api/v1/health]
    Routers --> Users[/api/v1/users]
    Routers --> Trips[/api/v1/trips]
    Routers --> PackingItems[/api/v1/packing-items]
    Routers --> Checklists[/api/v1/checklists]
    Routers --> Outfits[/api/v1/outfit-suggestions]
    Routers --> SavedOutfits[/api/v1/saved-outfits]
    Routers --> Templates[/api/v1/templates]
    Routers --> PackingAssistant[/api/v1/packing-assistant]
    Routers --> Weather[/api/v1/weather]
    Routers --> Chat[/api/v1/chat]

    PackingAssistant --> AIPacking[ai_packing.py]
    Chat --> AIChat[ai_chat.py]
    AIPacking --> PackingRules[packing_rules.py]
    Weather --> OWM[OpenWeatherMap]
```

### Layer Structure

```
backend/app/
  main.py          — FastAPI app, CORS, rate limiting, middleware
  config.py        — Pydantic settings from env vars
  database.py      — SQLAlchemy async setup
  auth.py          — JWT token creation/validation
  rate_limit.py    — SlowAPI configuration
  models/          — SQLAlchemy ORM models
  routers/         — API endpoint handlers
  services/        — Business logic (AI, packing rules)
  schemas/         — Pydantic request/response models
```

## API Request Flow

```mermaid
sequenceDiagram
    participant B as Browser
    participant F as Next.js
    participant A as FastAPI
    participant DB as Database

    B->>F: User action
    F->>A: fetch /api/v1/... (Bearer token)
    A->>A: get_current_user() validates JWT
    A->>DB: Query via SQLAlchemy async
    DB-->>A: Result
    A-->>F: JSON response
    F-->>B: UI update

    Note over F,A: On 401: clearAuth() → redirect /login
    Note over F,A: On network error: retry 2x with backoff
```

## Database Schema

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email
        string hashed_password
        string tier
        string subscription_plan
        datetime subscription_expires_at
    }

    trips {
        uuid id PK
        uuid user_id FK
        string title
        string destination_type
        string destination
        int duration_days
        json activities
        date start_date
        date end_date
        string status
    }

    packing_items {
        uuid id PK
        string name
        string category
        json destination_types
        boolean is_weather_dependent
        uuid user_id FK
    }

    trip_checklists {
        uuid id PK
        uuid trip_id FK
        uuid item_id FK
        boolean is_packed
        string custom_note
        int quantity
        string custom_item_name
        int sort_order
    }

    outfit_suggestions {
        uuid id PK
        string destination_type
        string occasion
        string weather_condition
        string description
        string image_url
        json style_tags
        string gender
        string season
    }

    saved_outfits {
        uuid id PK
        uuid user_id FK
        uuid outfit_id FK
    }

    checklist_templates {
        uuid id PK
        uuid user_id FK
        string name
        json items
    }

    users ||--o{ trips : "has"
    users ||--o{ saved_outfits : "saves"
    users ||--o{ checklist_templates : "creates"
    trips ||--o{ trip_checklists : "contains"
    packing_items ||--o{ trip_checklists : "referenced in"
    outfit_suggestions ||--o{ saved_outfits : "saved as"
```

## Deployment

```mermaid
graph TD
    DC[Docker Compose] --> Backend
    DC --> Frontend

    Backend[backend service] --> |Port 8000| API
    Backend --> |Health: GET /api/v1/health| API
    Backend --> |Env from .env| Config

    Frontend[frontend service] --> |Port 3002| Web
    Frontend --> |Depends: backend healthy| Backend
    Frontend --> |Build arg: NEXT_PUBLIC_API_URL| Config

    API[FastAPI] --> DB[(SQLite)]
    Web[Next.js] --> Browser
```
