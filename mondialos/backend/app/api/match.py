"""Match dashboard data — FIFA World Cup 2026 (verified static).

No fabricated live scores: we expose the confirmed tournament structure and
key fixtures. Live scores would require a real football API (out of scope for
the demo). The "status" field is always a schedule label, never a fake score.
"""
from fastapi import APIRouter

from app.api.schemas import MatchSummary

router = APIRouter(prefix="/match", tags=["match"])

# Confirmed framework fixtures only — no invented scores.
_MATCHES = [
    MatchSummary(id="open", home="Mexico", away="Opening Match", score="-", venue="Estadio Azteca (Mexico City)", status="11 Jun 2026 · Opening"),
    MatchSummary(id="final", home="Final", away="TBD", score="-", venue="MetLife Stadium (NY/NJ)", status="19 Jul 2026 · Final"),
    MatchSummary(id="g1", home="United States", away="Group A", score="-", venue="SoFi Stadium (Los Angeles)", status="Group stage · TBD"),
    MatchSummary(id="g2", home="Canada", away="Group B", score="-", venue="BMO Field (Toronto)", status="Group stage · TBD"),
    MatchSummary(id="g3", home="Argentina", away="Group C", score="-", venue="AT&T Stadium (Dallas)", status="Group stage · TBD"),
]


@router.get("", response_model=list[MatchSummary])
def matches():
    return _MATCHES
