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
| REPO, paths, PAT_KEY, GH_API constants | `app/admin/constants.ts` | 5 |
| GitHub REST API calls (posts read/write/delete) | `app/admin/github.ts` | 70 |
| `content/config.json` read + write via GitHub | `app/admin/config-api.ts` | 30 |
| `public/` image list + upload via GitHub | `app/admin/images-api.ts` | 35 |
| MDX front-matter builder, parser, slug util | `app/admin/mdx.ts` | 50 |
| `<Spinner>` and `<AdminHeader>` | `app/admin/ui.tsx` | 25 |
| Login screen (PAT entry + validation) | `app/admin/LoginScreen.tsx` | 75 |
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

---

## Config Files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js build config |
| `tsconfig.json` | TypeScript — path alias `@/*` = root |
| `vercel.json` | Vercel deployment settings |
| `postcss.config.mjs` | Tailwind CSS v4 via PostCSS |
| `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (git-ignored) |
