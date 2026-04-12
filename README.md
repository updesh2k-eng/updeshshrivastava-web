# Updesh Shrivastava — Personal Website

A personal brand website built with **Next.js 16**, **Tailwind CSS v4**, **MDX**, and **next-themes**.

## Features

- **5 pages**: Home, About, Work (case studies), Writing (blog), Contact
- **Dark / light theme toggle** with system preference detection
- **MDX blog posts** — add `.mdx` files to `content/posts/` to publish
- **Fully static** — all pages are pre-rendered at build time via `generateStaticParams`
- **Responsive** — mobile-first layout with hamburger nav
- **Bold & Creative** design with gradient accents and smooth transitions

## Tech Stack

- [Next.js 16](https://nextjs.org/) App Router
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [lucide-react](https://lucide.dev/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Blog Posts

Create a `.mdx` file in `content/posts/`:

```mdx
---
title: "Your Post Title"
date: "2025-04-12"
excerpt: "A short description shown on the listing page."
tags: ["Engineering", "TypeScript"]
readTime: "5 min read"
---

Your content here...
```

## Deploy

Connect this repo to [Vercel](https://vercel.com/) for zero-config deployment.
