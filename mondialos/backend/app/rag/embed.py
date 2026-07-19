"""Embedding helper using BAAI/bge-small-en-v1.5 via a free endpoint.

Fallback: a deterministic hash-based pseudo-embedding so the demo NEVER breaks
if no embedding service is configured. This is intentionally a corner-cut for
the hackathon; swap in a real bge-small endpoint in production.
"""
import hashlib
import os

import numpy as np

from app.core.config import settings

_DIM = settings.embedding_dim


def _pseudo_embed(text: str) -> list[float]:
    """Deterministic, keywork-aware pseudo embedding (demo fallback)."""
    vec = np.zeros(_DIM, dtype=float)
    tokens = text.lower().split()
    for i, tok in enumerate(tokens):
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        idx = h % _DIM
        vec[idx] += 1.0 / (1.0 + i * 0.01)
    # light normalization
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()


def embed(text: str) -> list[float]:
    """Return an embedding vector for `text`.

    If BGE_EMBED_URL is set, call it; otherwise use the deterministic fallback.
    The fallback keeps semantic-ish retrieval working offline for the demo.
    """
    url = os.environ.get("BGE_EMBED_URL")
    key = os.environ.get("BGE_EMBED_KEY")
    if url:
        import httpx

        headers = {"Authorization": f"Bearer {key}"} if key else {}
        r = httpx.post(url, json={"input": text}, headers=headers, timeout=20)
        r.raise_for_status()
        return r.json()["data"][0]["embedding"]
    return _pseudo_embed(text)


def embed_batch(texts: list[str]) -> list[list[float]]:
    return [embed(t) for t in texts]
