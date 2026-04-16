-- Comments table with admin moderation workflow
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text not null,
  author_name text not null,
  author_email text not null,
  content     text not null,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now()
);

-- Index for fast per-post lookups (only approved comments shown publicly)
create index if not exists comments_post_slug_status_idx on comments (post_slug, status);

-- Index for admin listing by status
create index if not exists comments_status_created_idx on comments (status, created_at desc);

-- Enable RLS
alter table comments enable row level security;

-- Public can read approved comments only
create policy "Public read approved comments"
  on comments for select
  using (status = 'approved');

-- Anyone can submit a comment (anon is enough — no auth required to post)
create policy "Anyone can submit a comment"
  on comments for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users (admin) can update status
create policy "Authenticated can update comment status"
  on comments for update
  to authenticated
  using (true)
  with check (true);

-- Only authenticated users (admin) can delete comments
create policy "Authenticated can delete comments"
  on comments for delete
  to authenticated
  using (true);
