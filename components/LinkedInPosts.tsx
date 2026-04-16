import { supabase } from "@/lib/supabase";
import { Linkedin } from "lucide-react";

interface LIPost {
  id: string;
  embed_url: string;
  caption: string | null;
  published_at: string | null;
}

async function getPosts(): Promise<LIPost[]> {
  const { data } = await supabase
    .from("linkedin_posts")
    .select("id, embed_url, caption, published_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as LIPost[];
}

interface Props {
  locale?: "en" | "de";
}

export async function LinkedInPosts({ locale = "en" }: Props) {
  const posts = await getPosts();
  if (posts.length === 0) return null;

  const title = locale === "de" ? "Auf LinkedIn" : "From LinkedIn";
  const viewAll = locale === "de" ? "Alle Beiträge ansehen" : "View all posts";

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(10,102,194,0.12)", border: "1px solid rgba(10,102,194,0.25)" }}>
            <Linkedin size={15} style={{ color: "#0a66c2" }} />
          </div>
          <h2 className="font-bold text-lg">{title}</h2>
        </div>
        <a
          href="https://www.linkedin.com/in/updesh-shrivastava-70123814/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold hover:opacity-70 transition-opacity"
          style={{ color: "#0a66c2" }}
        >
          {viewAll} →
        </a>
      </div>

      {/* Posts grid — horizontal scroll on mobile, 1-2 columns on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible">
        {posts.map((p) => (
          <div
            key={p.id}
            className="shrink-0 w-[85vw] sm:w-auto snap-start rounded-2xl border overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <iframe
              src={p.embed_url}
              className="w-full"
              style={{ height: "400px", border: "none", display: "block" }}
              title={p.caption || "LinkedIn post"}
              loading="lazy"
              allowFullScreen
            />
            {p.caption && (
              <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{p.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
