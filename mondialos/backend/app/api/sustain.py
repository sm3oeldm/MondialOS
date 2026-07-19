"""Sustainability: carbon estimate + greener alternative."""
from fastapi import APIRouter

from app.api.schemas import CarbonRequest, CarbonResponse

router = APIRouter(prefix="/sustain", tags=["sustain"])

# kg CO2 per passenger-km (rough, public estimates)
_FACTORS = {
    "car": 0.171,
    "bus": 0.089,
    "train": 0.041,
    "walk": 0.0,
    "flight": 0.255,
}


@router.post("/carbon", response_model=CarbonResponse)
def carbon(req: CarbonRequest):
    mode = req.mode.lower()
    factor = _FACTORS.get(mode, 0.171)
    kg = round(req.distance_km * factor, 2)

    # greener alternative
    if mode in ("car", "flight"):
        alt = "train"
    elif mode == "bus":
        alt = "walk"
    else:
        alt = "train"
    alt_factor = _FACTORS.get(alt, 0.041)
    alt_kg = round(req.distance_km * alt_factor, 2)
    savings = round(max(0.0, kg - alt_kg), 2)

    return CarbonResponse(
        mode=mode,
        distance_km=req.distance_km,
        kg_co2=kg,
        greener_alternative=alt,
        savings_kg=savings,
    )
