import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getNewsItems } from "@/lib/supabase-news";
import { NewsGrid } from "./NewsGrid";

export const metadata: Metadata = {
  title: "AI News",
  description:
    "Curated daily AI news — scored by Claude for relevance. No hype, no filler. Sources: TechCrunch, The Verge, VentureBeat, MIT Tech Review, OpenAI, DeepMind, Wired, Hacker News, arXiv.",
  alternates: { canonical: "https://updeshshrivastava.com/ai-news" },
};

// ISR: page regenerates every hour so news stays fresh without a full rebuild
export const revalidate = 3600;

const SOURCES = [
  { name: "TechCrunch", url: "https://techcrunch.com/category/artificial-intelligence/" },
  { name: "The Verge", url: "https://www.theverge.com/ai-artificial-intelligence" },
  { name: "VentureBeat", url: "https://venturebeat.com/ai/" },
  { name: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/" },
  { name: "Wired", url: "https://www.wired.com/tag/artificial-intelligence/" },
  { name: "OpenAI Blog", url: "https://openai.com/blog" },
  { name: "DeepMind", url: "https://deepmind.google/blog/" },
  { name: "Hacker News", url: "https://news.ycombinator.com" },
  { name: "arXiv CS.AI", url: "https://arxiv.org/list/cs.AI/recent" },
];

export default async function AINewsPage() {
  const items = await getNewsItems(120, 14).catch(() => []);

  // Most recent created_at tells us when the last fetch ran
  const lastFetch = items.length > 0
    ? new Date(Math.max(...items.map((i) => new Date(i.created_at).getTime())))
    : null;

  const todayCount = items.filter((i) => {
    if (!i.created_at) return false;
    const d = new Date(i.created_at);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
  }).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">AI News</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed max-w-2xl mb-4" style={{ color: "var(--muted)" }}>
          Curated daily from 9 leading AI sources. Every article is scored by Claude for
          relevance and quality — only the signal, none of the noise.
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
          {lastFetch && (
            <span>
              Updated{" "}
              {lastFetch.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
                timeZoneName: "short",
              })}
            </span>
          )}
          {todayCount > 0 && (
            <>
              <span className="opacity-40">·</span>
              <span className="text-green-400">{todayCount} new today</span>
            </>
          )}
          {items.length > 0 && (
            <>
              <span className="opacity-40">·</span>
              <span>{items.length} articles</span>
            </>
          )}
          <span className="opacity-40">·</span>
          <span className="inline-flex items-center gap-1">
            <Sparkles size={11} className="text-purple-400" />
            Relevance scored by Claude AI
          </span>
        </div>
      </section>

      {/* ── News grid with client-side category filter ───────────────────────── */}
      <NewsGrid items={items} />

      {/* ── Attribution footer ───────────────────────────────────────────────── */}
      <footer className="mt-20 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
          Sources
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-6">
          {SOURCES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:opacity-70 transition-opacity underline underline-offset-2"
              style={{ color: "var(--muted)" }}
            >
              {s.name}
            </a>
          ))}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Headlines and excerpts are shown for attribution and discovery only — all articles
          link to their original source. This page does not reproduce full article content.
          Relevance filtering is automated via Claude AI and updated daily.
        </p>
      </footer>
    </div>
  );
}
