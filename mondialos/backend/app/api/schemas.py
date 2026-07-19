"""Pydantic schemas for API requests/responses."""
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class AgentIdStr(str, Enum):
    fan = "fan"
    stadium = "stadium"
    match = "match"
    crowd = "crowd"
    sustain = "sustain"


class ChatRequest(BaseModel):
    message: str
    agent: Optional[AgentIdStr] = None
    history: list[dict] = []


class ChatResponse(BaseModel):
    agent: str
    agent_name: str
    agent_icon: str
    agent_color: str
    reply: str
    sources: list[str] = []
    simulated: bool = False


class CrowdPoint(BaseModel):
    gate: str
    level: int  # 0-100 congestion


class CrowdResponse(BaseModel):
    stadium: str
    points: list[CrowdPoint]
    recommendation: str
    simulated: bool = True


class CarbonRequest(BaseModel):
    distance_km: float
    mode: str  # car | bus | train | walk | flight


class CarbonResponse(BaseModel):
    mode: str
    distance_km: float
    kg_co2: float
    greener_alternative: str
    savings_kg: float


class MatchSummary(BaseModel):
    id: str
    home: str
    away: str
    score: str
    venue: str
    status: str
