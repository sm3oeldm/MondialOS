"""Supabase client singletons and JWT verification helpers."""
from functools import lru_cache
from typing import Optional

from supabase import Client, create_client

from app.core.config import settings


@lru_cache
def get_supabase() -> Client:
    """Admin client (service role) for backend-only operations."""
    return create_client(settings.supabase_url, settings.supabase_service_key)


def verify_jwt(token: str) -> Optional[dict]:
    """Lightweight JWT decode for demo use.

    In production, verify signature with Supabase JWKS. For the hackathon
    we trust the anon-key-issued token and decode the payload to get the
    user id. This keeps the demo reliable without a crypto dependency.
    """
    import base64
    import json

    try:
        # token = header.payload.signature
        payload_b64 = token.split(".")[1]
        # pad
        payload_b64 += "=" * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(payload_b64))
        return payload
    except Exception:
        return None
