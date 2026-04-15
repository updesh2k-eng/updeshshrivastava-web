-- Supabase Storage: post-media bucket for blog post images
-- Run in Supabase dashboard → SQL Editor → New query

-- 1. Create the bucket (public = images are readable without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-media',
  'post-media',
  true,
  5242880,   -- 5 MB per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880;

-- 2. Allow authenticated users (admin) to upload
DROP POLICY IF EXISTS "Auth upload post-media"  ON storage.objects;
CREATE POLICY "Auth upload post-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-media');

-- 3. Allow authenticated users to replace / upsert
DROP POLICY IF EXISTS "Auth update post-media"  ON storage.objects;
CREATE POLICY "Auth update post-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-media');

-- 4. Allow authenticated users to delete their uploads
DROP POLICY IF EXISTS "Auth delete post-media"  ON storage.objects;
CREATE POLICY "Auth delete post-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-media');

-- 5. Public read — so the <img> tags in posts load for everyone
DROP POLICY IF EXISTS "Public read post-media"  ON storage.objects;
CREATE POLICY "Public read post-media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'post-media');
