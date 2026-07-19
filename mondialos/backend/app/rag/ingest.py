"""Seed the knowledge base from data/*.md into pgvector.

Run once:  python -m app.rag.ingest
Creates the `knowledge` table if missing and inserts chunks.
"""
import os
import re

from app.core.db import get_conn
from app.rag.embed import embed

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")


def _chunk(text: str, size: int = 600) -> list[str]:
    """Split text into overlap-free ~size-char chunks on paragraph boundaries."""
    paras = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks, buf = [], ""
    for p in paras:
        if len(buf) + len(p) > size and buf:
            chunks.append(buf)
            buf = p
        else:
            buf += ("\n\n" + p) if buf else p
    if buf:
        chunks.append(buf)
    return chunks


def ingest_file(path: str, collection: str):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    chunks = _chunk(text)
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS knowledge (
            id SERIAL PRIMARY KEY,
            content TEXT,
            source TEXT,
            collection TEXT,
            embedding vector(%s)
        );
        """,
        (os.environ.get("EMBEDDING_DIM", "384"),),
    )
    for ch in chunks:
        vec = embed(ch)
        cur.execute(
            "INSERT INTO knowledge (content, source, collection, embedding) VALUES (%s,%s,%s,%s::vector)",
            (ch, os.path.basename(path), collection, vec),
        )
    conn.commit()
    cur.close()
    conn.close()
    print(f"  ingested {len(chunks)} chunks from {os.path.basename(path)} -> {collection}")


def main():
    mapping = {
        "stadiums.md": "stadiums",
        "transport.md": "transport",
        "faq.md": "faq",
        "visitor_guides.md": "visitor_guides",
        "venue_policies.md": "venue_policies",
        "accessibility.md": "accessibility",
        "matches.md": "matches",
        "teams.md": "teams",
    }
    print("Seeding MondialOS knowledge base...")
    for fname, coll in mapping.items():
        fp = os.path.join(DATA_DIR, fname)
        if os.path.exists(fp):
            ingest_file(fp, coll)
        else:
            print(f"  skip (missing): {fname}")
    print("Done.")


if __name__ == "__main__":
    main()
