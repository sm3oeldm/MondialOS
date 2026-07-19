"""Chat endpoint: agent routing + RAG + LLM."""
from fastapi import APIRouter, Depends, Header, HTTPException

from app.agents.personas import PERSONAS
from app.agents.router import route_agent
from app.api.schemas import AgentIdStr, ChatRequest, ChatResponse
from app.core.supabase import verify_jwt
from app.rag import retrieve
from app.core.llm import generate

router = APIRouter(prefix="/chat", tags=["chat"])


def _auth(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    payload = verify_jwt(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload["sub"]


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, user_id: str = Depends(_auth)):
    preferred = AgentIdStr(req.agent).value if req.agent else None
    agent_id = route_agent(req.message, preferred)
    persona = PERSONAS[agent_id]

    # RAG: retrieve from the agent's allowed collections
    chunks = []
    for coll in persona.rag_collections:
        chunks += retrieve(req.message, collection=coll, top_k=2)
    context = retrieve.format_context(chunks)
    sources = sorted({c.get("source") for c in chunks if c.get("source")})

    history_text = "\n".join(
        f"{h.get('role','user')}: {h.get('content','')}" for h in req.history[-6:]
    )

    prompt = f"""Context from MondialOS knowledge base:
{context}

Recent conversation:
{history_text}

User message:
{req.message}

Respond as the {persona.name}. Be concise, practical, and on-brand. Use the
context when relevant. If the context is empty, answer from general knowledge
but stay in character."""

    reply = generate(persona.system_prompt, prompt)

    return ChatResponse(
        agent=persona.id.value,
        agent_name=persona.name,
        agent_icon=persona.icon,
        agent_color=persona.color,
        reply=reply,
        sources=sources,
        simulated=("no LLM key" in reply),
    )
