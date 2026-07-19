# 🌍 MondialOS — AI Operating System for the FIFA World Cup

> One platform. Every agent. The World Cup, intelligently orchestrated.

MondialOS is an AI-powered operating system for the FIFA World Cup that unifies
**5 specialized AI agents** behind one premium, mobile-first interface:

| Agent | Role |
|---|---|
| 🎟️ **Fan Agent** | Personalized itineraries, reminders, recommendations |
| 🏟️ **Stadium Agent** | NL Q&A over stadium docs (gates, restrooms, parking) |
| ⚽ **Match Intelligence** | Tactics, player insights, post-match reports |
| 📊 **Crowd Intelligence** | Congestion heatmaps & route suggestions (simulated) |
| 🌱 **Sustainability Agent** | Carbon estimates & greener travel tips |

## Architecture

```
Next.js (TS) ──▶ FastAPI ──▶ Mistral AI / OpenRouter
   Tailwind           ├── Agent Router (intent → persona)
   shadcn/ui          ├── RAG (pgvector + bge-small)
   Framer/Leaflet     └── Supabase (Auth + Postgres + pgvector)
```

## Stack

- **Frontend:** Next.js · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts · Leaflet · Zustand · TanStack Query
- **Backend:** FastAPI · Pydantic
- **DB / Auth / Vector:** Supabase (Postgres + pgvector + Auth)
- **AI:** Mistral AI (OpenRouter fallback)
- **Maps:** OpenStreetMap / Leaflet / Nominatim

## Quick Start

### 1. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill SUPABASE_* (DB url + password) and MISTRAL_API_KEY
# seed knowledge base (needs SUPABASE_DB_URL):
python -m app.rag.ingest
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_*
npm run dev
```

### 3. Supabase
Apply `supabase/migrations/0001_init.sql` in the Supabase SQL editor (enables
`vector` and creates the `knowledge` + `fan_profiles` tables).

## Notes
- Crowd congestion figures are **simulated and labeled** in the UI.
- The embedding layer uses a deterministic fallback when no BGE endpoint is
  configured, so RAG works in the demo without external embedding costs.
- Auth is handled by Supabase; the FastAPI backend verifies the Supabase JWT.
