-- Admin-managed LinkedIn post embeds
-- Each row is one embedded LinkedIn post shown on the Writing page
create table if not exists linkedin_posts (
  id           uuid primary key default gen_random_uuid(),
  embed_url    text not null,          -- https://www.linkedin.com/embed/feed/update/urn:li:...
  caption      text,                   -- optional short description shown below iframe
  published_at date,                   -- date of the LinkedIn post (for sorting)
  display_order integer not null default 0,
  created_at   timestamptz not null default now()
);

-- RLS
alter table linkedin_posts enable row level security;

-- Anyone can read (public section on Writing page)
create policy "Public read linkedin_posts"
  on linkedin_posts for select
  using (true);

-- Only authenticated admin can write
create policy "Authenticated can manage linkedin_posts"
  on linkedin_posts for all
  to authenticated
  using (true)
  with check (true);
