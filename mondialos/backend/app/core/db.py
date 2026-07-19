"""Database connection helpers for pgvector via psycopg2."""
import psycopg2
from psycopg2.extras import RealDictCursor

from app.core.config import settings


def get_conn():
    """Return a psycopg2 connection to the Supabase Postgres DB."""
    return psycopg2.connect(settings.supabase_db_url, cursor_factory=RealDictCursor)
