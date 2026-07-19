"""pgvector retrieval for the RAG knowledge base."""
from typing import Optional

from app.core.db import get_conn
from app.rag.embed import embed


def retrieve(query: str, collection: Optional[str] = None, top_k: int = 4) -> list[dict]:
    """Return top_k chunks from the knowledge base relevant to `query`.

    Uses cosine similarity via pgvector's <=> operator. If collection is
    provided, filters to that collection. Gracefully returns [] if the table
    is empty or unavailable (so the LLM still answers from its own knowledge).
    """
    try:
        qvec = embed(query)
        conn = get_conn()
        cur = conn.cursor()
        if collection:
            cur.execute(
                """
                SELECT content, source, collection,
                       1 - (embedding <=> %s::vector) AS score
                FROM knowledge
                WHERE collection = %s
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
                """,
                (qvec, collection, qvec, top_k),
            )
        else:
            cur.execute(
                """
                SELECT content, source, collection,
                       1 - (embedding <=> %s::vector) AS score
                FROM knowledge
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
                """,
                (qvec, qvec, top_k),
            )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        # Never let retrieval break the chat. Log and return empty.
        print(f"[rag] retrieve failed: {e}")
        return []


def format_context(chunks: list[dict]) -> str:
    if not chunks:
        return "No retrieved documents."
    parts = []
    for i, c in enumerate(chunks, 1):
        src = c.get("source") or c.get("collection") or "unknown"
        parts.append(f"[Doc {i} | {src}]\n{c['content']}")
    return "\n\n".join(parts)
