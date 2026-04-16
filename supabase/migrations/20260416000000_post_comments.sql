-- Post comments table
-- Run in Supabase dashboard → SQL Editor → New query

CREATE TABLE IF NOT EXISTS public.post_comments (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug  text        NOT NULL,
  name       text        NOT NULL,
  email      text        NOT NULL,
  content    text        NOT NULL,
  approved   boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS post_comments_slug_idx
  ON public.post_comments (post_slug, approved, created_at DESC);

-- RLS
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
DROP POLICY IF EXISTS "Public read approved comments" ON public.post_comments;
CREATE POLICY "Public read approved comments"
  ON public.post_comments FOR SELECT
  USING (approved = true);

-- Anyone can insert (submit a comment)
DROP POLICY IF EXISTS "Public insert comments" ON public.post_comments;
CREATE POLICY "Public insert comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin can approve / delete
DROP POLICY IF EXISTS "Admin manage comments" ON public.post_comments;
CREATE POLICY "Admin manage comments"
  ON public.post_comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
