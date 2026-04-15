"use client";

import { useState, useMemo } from "react";
import type { NewsItem } from "@/lib/supabase-news";
import { NewsCard } from "./NewsCard";

type Category = "All" | "LLMs" | "Research" | "Tools" | "Policy" | "Robotics" | "Industry";

const CATEGORIES: Category[] = ["All", "LLMs", "Research", "Tools", "Policy", "Robotics", "Industry"];

export function NewsGrid({ items }: { items: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    for (const item of items) {
      const cat = item.category ?? "Uncategorized";
      map[cat] = (map[cat] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? items
        : items.filter((i) => i.category === activeCategory),
    [items, activeCategory]
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-24 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>
          No articles yet — the daily fetch hasn&apos;t run.
        </p>
        <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.6 }}>
          Check back after 6:00 AM UTC.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Category filter ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((cat) => {
          const count = counts[cat] ?? 0;
          const active = activeCategory === cat;
          // Skip categories with zero articles (except All)
          if (cat !== "All" && count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                active ? "gradient-bg text-white shadow-sm" : "border hover:opacity-80"
              }`}
              style={
                active
                  ? {}
                  : { borderColor: "var(--border)", color: "var(--muted)", background: "var(--card)" }
              }
            >
              {cat}
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${active ? "bg-white/20" : ""}`}
                style={active ? {} : { color: "var(--muted)", opacity: 0.7 }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No articles in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
