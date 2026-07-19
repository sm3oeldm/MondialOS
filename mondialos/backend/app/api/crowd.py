"""Crowd Intelligence endpoint (SIMULATED data, clearly labeled)."""
from fastapi import APIRouter

from app.api.schemas import CrowdPoint, CrowdResponse

router = APIRouter(prefix="/crowd", tags=["crowd"])

# Deterministic pseudo-congestion per stadium gate. Clearly simulated for demo.
_STADIUMS = {
    "lusail": [
        CrowdPoint(gate="Gate A", level=72),
        CrowdPoint(gate="Gate B", level=38),
        CrowdPoint(gate="Gate C", level=81),
        CrowdPoint(gate="Gate D", level=25),
        CrowdPoint(gate="VIP", level=12),
    ],
    "ikb": [
        CrowdPoint(gate="North", level=55),
        CrowdPoint(gate="South", level=90),
        CrowdPoint(gate="East", level=44),
        CrowdPoint(gate="West", level=30),
    ],
}


@router.get("/{stadium}", response_model=CrowdResponse)
def crowd(stadium: str):
    points = _STADIUMS.get(stadium.lower(), _STADIUMS["lusail"])
    worst = max(points, key=lambda p: p.level)
    best = min(points, key=lambda p: p.level)
    rec = (
        f"Avoid {worst.gate} (congestion {worst.level}%). "
        f"Use {best.gate} for the fastest entry (level {best.level}%)."
    )
    return CrowdResponse(
        stadium=stadium, points=points, recommendation=rec, simulated=True
    )
