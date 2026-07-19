"""MondialOS FastAPI backend entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.agents.personas import AGENT_LIST
from app.api import chat, crowd, sustain, match

app = FastAPI(title="MondialOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(crowd.router)
app.include_router(sustain.router)
app.include_router(match.router)


@app.get("/health")
def health():
    return {"status": "ok", "product": "MondialOS"}


@app.get("/agents")
def agents():
    """List available agents (used by the chat UI to render agent chips)."""
    return [
        {
            "id": a.id.value,
            "name": a.name,
            "tagline": a.tagline,
            "icon": a.icon,
            "color": a.color,
        }
        for a in AGENT_LIST
    ]
