"""Intent router: maps a user message to the best agent persona."""
from app.agents.personas import AgentId, PERSONAS


# keyword -> agent scoring (cheap, reliable, no LLM call needed for routing)
_KEYWORDS: dict[AgentId, list[str]] = {
    AgentId.FAN: ["itinerary", "plan", "restaurant", "hotel", "budget", "remind",
                  "things to do", "attraction", "visit", "fan", "schedule my", "trip"],
    AgentId.STADIUM: ["gate", "entrance", "restroom", "toilet", "parking", "security",
                      "checkpoint", "seat", "lost and found", "accessible", "wheelchair",
                      "stadium", "facility", "food court"],
    AgentId.MATCH: ["tactic", "formation", "player", "summary", "match report",
                    "statistics", "stats", "key moment", "who won", "lineup", "xg"],
    AgentId.CROWD: ["crowd", "busy", "congestion", "wait", "queue", "packed",
                    "overcrowd", "entrance recommend", "route", "heatmap", "traffic"],
    AgentId.SUSTAIN: ["carbon", "footprint", "sustainab", "eco", "green", "transit",
                      "public transport", "co2", "emission", "environment"],
}


def route_agent(message: str, preferred: AgentId | None = None) -> AgentId:
    """Return the best agent for a message.

    If the client passes an explicit preferred agent (user clicked an agent
    chip), honor it. Otherwise score by keywords and fall back to Fan Agent.
    """
    if preferred and preferred in PERSONAS:
        return preferred

    text = message.lower()
    scores = {aid: 0 for aid in AgentId}
    for aid, kws in _KEYWORDS.items():
        for kw in kws:
            if kw in text:
                scores[aid] += 1

    best = max(scores, key=scores.get)
    if scores[best] == 0:
        return AgentId.FAN
    return best
