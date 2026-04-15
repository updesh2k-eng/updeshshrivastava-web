# Codebase Map

Read this first. Find the one file you need, open only that file.

---

## Site Data

| What to change | File |
|---|---|
| Brand name, tagline | `content/config.json` → `brand` |
| Nav links (label, order, visibility) | `content/config.json` → `nav` |
| Home hero, proof points, social URLs | `content/config.json` → `home` |
| Featured work cards, CTA section | `content/config.json` → `home.featuredWork` / `home.ctaSection` |
| Blog posts (MDX source) | `content/posts/<slug>.mdx` |

---

## Pages

| Route | File |
|---|---|
| `/` Home | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/work` | `app/work/page.tsx` |
| `/writing` | `app/writing/page.tsx` |
| `/writing/[slug]` | `app/writing/[slug]/page.tsx` |
| `/writing/[slug]` view counter (client) | `app/writing/[slug]/ViewCounter.tsx` |
| `/writing/preview/[id]` Draft preview | `app/writing/preview/[id]/page.tsx` |
| `/api/views` POST — increment view count | `app/api/views/route.ts` |
| `/api/github/config` GET/PUT — read/write site config via GitHub API | `app/api/github/config/route.ts` |
| `/api/github/images` GET/POST — list/upload images via GitHub API | `app/api/github/images/route.ts` |
| `/feed.xml` RSS 2.0 feed | `app/feed.xml/route.ts` |
| `/ai-news` AI news curated daily | `app/ai-news/page.tsx` |
| `/principles` | `app/principles/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/admin` view router | `app/admin/page.tsx` |
| Root layout + metadata | `app/layout.tsx` |
| Global CSS + theme variables | `app/globals.css` |

---

## Admin Panel (`app/admin/`)

Each concern is its own file — read only what you need to edit.

| What | File | ~Lines |
|---|---|---|
| View routing (login → dashboard → screens) | `app/admin/page.tsx` | 60 |
| All TypeScript types and interfaces | `app/admin/types.ts` | 60 |
| REPO, paths, GH_API constants | `app/admin/constants.ts` | 5 |
| `content/config.json` read + write (calls `/api/github/config`) | `app/admin/config-api.ts` | 35 |
| `public/` image list + upload (calls `/api/github/images`) | `app/admin/images-api.ts` | 35 |
| MDX front-matter builder, parser, slug util | `app/admin/mdx.ts` | 50 |
| `<Spinner>` and `<AdminHeader>` | `app/admin/ui.tsx` | 25 |
| Login screen (email + password via Supabase auth) | `app/admin/LoginScreen.tsx` | 75 |
| Dashboard (4-card nav grid) | `app/admin/DashboardScreen.tsx` | 45 |
| Blog post list (Supabase) | `app/admin/PostListScreen.tsx` | 90 |
| Blog post create/edit form (Supabase + Tiptap) | `app/admin/PostEditorScreen.tsx` | 130 |
| Nav link editor (label, order, visibility) | `app/admin/NavEditorScreen.tsx` | 80 |
| Home page editor (brand, hero, featured work, CTA) | `app/admin/HomeEditorScreen.tsx` | 115 |
| Image manager (list + upload to GitHub) | `app/admin/ImagesScreen.tsx` | 75 |

---

## Shared Components (`components/`)

| Component | File |
|---|---|
| Site navigation bar | `components/Navbar.tsx` |
| Site footer | `components/Footer.tsx` |
| Layout wrapper (Navbar + Footer) | `components/SiteChrome.tsx` |
| Dark/light theme provider | `components/ThemeProvider.tsx` |
| Theme toggle button | `components/ThemeToggle.tsx` |
| MDX renderer | `components/MDXRemote.tsx` |
| Tiptap rich text editor | `components/Editor.tsx` |
| Contact form | `components/ContactForm.tsx` |
| Newsletter subscribe form | `components/SubscribeForm.tsx` |
| Social share buttons | `components/SocialShare.tsx` |
| Social icon set | `components/SocialIcons.tsx` |
| Reading progress bar | `components/ReadingProgress.tsx` |

---

## Data Layer (`lib/`)

| What | File |
|---|---|
| Load `content/config.json` server-side | `lib/config.ts` → `getSiteConfig()` |
| Load MDX posts server-side | `lib/posts.ts` → `getAllPosts()`, `getPostBySlug()` |
| Supabase client | `lib/supabase.ts` |
| Supabase post queries | `lib/supabase-posts.ts` |
| MDX → Supabase migration util | `lib/migrate.ts` |
| AI news item types + Supabase query | `lib/supabase-news.ts` |

---

## Config Files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js build config |
| `tsconfig.json` | TypeScript — path alias `@/*` = root |
| `vercel.json` | Vercel deployment settings |
| `postcss.config.mjs` | Tailwind CSS v4 via PostCSS |
| `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GITHUB_PAT` (git-ignored) |

---

## Agentic News System

| File | Purpose |
|---|---|
| `scripts/fetch-news.mjs` | Daily fetcher: RSS → Claude scoring → Supabase upsert |
| `.github/workflows/fetch-news.yml` | GitHub Actions cron (06:00 UTC daily) |
| `supabase/migrations/20260415000000_news_items.sql` | `news_items` table DDL + RLS |
| `app/ai-news/page.tsx` | News page (ISR 1 h) |
| `app/ai-news/NewsGrid.tsx` | Client component — category filter tabs |
| `app/ai-news/NewsCard.tsx` | Individual news card |

**GitHub Secrets required** (Settings → Secrets → Actions):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` ← Supabase dashboard → Project Settings → API
- `ANTHROPIC_API_KEY` ← console.anthropic.com
