"""LLM client — Mistral AI (primary) with OpenRouter fallback.

Mistral's hosted API (api.mistral.ai) is OpenAI-compatible: chat completions
at /v1/chat/completions with a Bearer key. We keep the free OpenRouter model
as an automatic fallback if Mistral is unavailable.
"""
import httpx

from app.core.config import settings

# Mistral's free-tier chat model. Swap to a larger model if you have credits.
MISTRAL_MODEL = "mistral-small-latest"


def _call_mistral(system: str, user: str) -> str | None:
    if not settings.mistral_api_key:
        return None
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.mistral_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MISTRAL_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.7,
        "max_tokens": 700,
    }
    try:
        r = httpx.post(url, json=payload, headers=headers, timeout=30)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[llm] mistral failed: {e}")
        return None


def _call_openrouter(system: str, user: str) -> str | None:
    if not settings.openrouter_api_key:
        return None
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.openrouter_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.7,
        "max_tokens": 700,
    }
    try:
        r = httpx.post(url, json=payload, headers=headers, timeout=30)
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[llm] openrouter failed: {e}")
        return None


def generate(system: str, user: str) -> str:
    """Try Mistral, then OpenRouter; final fallback is a graceful message."""
    out = _call_mistral(system, user)
    if out:
        return out
    out = _call_openrouter(system, user)
    if out:
        return out
    return (
        "MondialOS is running in offline demo mode (no LLM key configured). "
        "Here is a structured placeholder response based on the retrieved "
        "knowledge. Add a MISTRAL_API_KEY or OPENROUTER_API_KEY to enable live AI."
    )
