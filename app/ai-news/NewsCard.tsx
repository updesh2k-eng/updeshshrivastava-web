import { ExternalLink } from "lucide-react";
import type { NewsItem } from "@/lib/supabase-news";

// One accent color per category — visible in both light and dark themes
const CATEGORY_STYLE: Record<string, { pill: string; strip: string }> = {
  LLMs:     { pill: "bg-sky-500/10 text-sky-400",      strip: "#38bdf8" },
  Research: { pill: "bg-purple-500/10 text-purple-400", strip: "#a78bfa" },
  Tools:    { pill: "bg-green-500/10 text-green-400",   strip: "#4ade80" },
  Policy:   { pill: "bg-orange-500/10 text-orange-400", strip: "#fb923c" },
  Robotics: { pill: "bg-cyan-500/10 text-cyan-400",     strip: "#22d3ee" },
  Industry: { pill: "bg-amber-500/10 text-amber-400",   strip: "#fbbf24" },
};

const DEFAULT_STYLE = { pill: "bg-zinc-500/10 text-zinc-400", strip: "#71717a" };

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NewsCard({ item }: { item: NewsItem }) {
  const style = CATEGORY_STYLE[item.category ?? ""] ?? DEFAULT_STYLE;
  const date = formatDate(item.published_at);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border overflow-hidden hover:border-sky-500/40 hover:-translate-y-0.5 transition-all duration-200"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Cover image or category colour strip */}
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-44 object-cover"
          onError={(e) => {
            // Replace broken image with coloured strip gracefully
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              (e.target as HTMLImageElement).style.display = "none";
              const strip = document.createElement("div");
              strip.style.cssText = `height:4px;width:100%;background:${style.strip};opacity:0.7`;
              parent.insertBefore(strip, parent.firstChild);
            }
          }}
        />
      ) : (
        <div className="h-1 w-full" style={{ background: style.strip, opacity: 0.7 }} />
      )}

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {item.category && item.category !== "Uncategorized" && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.pill}`}>
              {item.category}
            </span>
          )}
          <span
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}
          >
            {item.source}
          </span>
          {item.relevance_score && item.relevance_score >= 9 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-medium">
              ★ Top pick
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-3 group-hover:opacity-70 transition-opacity">
          {item.title}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p
            className="text-xs leading-relaxed line-clamp-3 flex-1"
            style={{ color: "var(--muted)" }}
          >
            {item.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          {date ? (
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {date}
            </span>
          ) : (
            <span />
          )}
          <span
            className="text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            Read <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </a>
  );
}
