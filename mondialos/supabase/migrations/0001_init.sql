-- MondialOS initial schema
-- Enables pgvector for the RAG knowledge base.

create extension if not exists vector;

-- Knowledge base chunks for RAG
create table if not exists knowledge (
    id serial primary key,
    content text,
    source text,
    collection text,
    embedding vector(384)
);

create index if not exists knowledge_embedding_idx
    on knowledge using ivfflat (embedding vector_cosine_ops) with (lists = 10);

-- Optional: stored fan itineraries / scores (used by future features)
create table if not exists fan_profiles (
    user_id uuid primary key references auth.users(id),
    favorite_team text,
    hotel_location text,
    language text default 'en',
    created_at timestamptz default now()
);
