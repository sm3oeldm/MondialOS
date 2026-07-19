"""Match dashboard data (hardcoded WC schedule for the demo)."""
from fastapi import APIRouter

from app.api.schemas import MatchSummary

router = APIRouter(prefix="/match", tags=["match"])

_MATCHES = [
    MatchSummary(id="m1", home="Morocco", away="Portugal", score="2-1", venue="Lusail", status="FT"),
    MatchSummary(id="m2", home="Japan", away="Brazil", score="0-0", venue="IKB", status="Live 67'"),
    MatchSummary(id="m3", home="Senegal", away="France", score="-", venue="Lusail", status="Today 20:00"),
    MatchSummary(id="m4", home="Korea", away="Argentina", score="1-3", venue="IKB", status="FT"),
    MatchSummary(id="m5", home="Mexico", away="Spain", score="-", venue="Lusail", status="Tomorrow 19:00"),
]


@router.get("", response_model=list[MatchSummary])
def matches():
    return _MATCHES
