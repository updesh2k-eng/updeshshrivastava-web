-- Run this in Supabase dashboard → SQL Editor → New query
-- Safe to run multiple times — uses IF NOT EXISTS / OR REPLACE throughout

-- 1. Ensure the posts table has all required columns
--    (add any that are missing from the original table)

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS views        integer       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS read_time    text,
  ADD COLUMN IF NOT EXISTS cover_image  text,
  ADD COLUMN IF NOT EXISTS content_html text,
  ADD COLUMN IF NOT EXISTS content_json jsonb,
  ADD COLUMN IF NOT EXISTS tags         text[]        NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS excerpt      text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at   timestamptz   DEFAULT now();

-- 2. Row Level Security — allow the admin (authenticated user) to do everything,
--    allow anon to read published posts only

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any, then recreate cleanly
DROP POLICY IF EXISTS "Public read published"   ON public.posts;
DROP POLICY IF EXISTS "Admin full access"        ON public.posts;

-- Anon / public: only see published posts
CREATE POLICY "Public read published" ON public.posts
  FOR SELECT USING (status = 'published');

-- Authenticated admin: full read/write access
CREATE POLICY "Admin full access" ON public.posts
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Stored procedure to increment views atomically
CREATE OR REPLACE FUNCTION public.increment_views(post_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.posts SET views = views + 1 WHERE slug = post_slug;
END;
$$;
