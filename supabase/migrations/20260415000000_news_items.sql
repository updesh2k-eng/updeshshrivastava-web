-- AI News items table
-- Run this in the Supabase SQL Editor (dashboard → SQL Editor → New query)

create table if not exists public.news_items (
  id              text primary key,                    -- SHA-256 of article URL (32 hex chars)
  title           text not null,
  excerpt         text,
  url             text not null unique,
  source          text not null,                       -- e.g. "TechCrunch"
  source_url      text,                                -- source homepage
  image_url       text,
  published_at    timestamptz,
  category        text,                                -- LLMs | Research | Tools | Policy | Robotics | Industry
  relevance_score integer check (relevance_score between 1 and 10),
  created_at      timestamptz default now() not null
);

-- Indexes for common query patterns
create index if not exists news_items_published_at_idx
  on public.news_items (published_at desc);

create index if not exists news_items_category_idx
  on public.news_items (category);

-- Row Level Security
-- Public can read; only the service role key (used by GitHub Actions) can write.
alter table public.news_items enable row level security;

drop policy if exists "news_items_public_read" on public.news_items;
create policy "news_items_public_read"
  on public.news_items for select
  using (true);

-- No insert/update/delete policies for anon — the fetch script uses
-- the service role key which bypasses RLS entirely.
