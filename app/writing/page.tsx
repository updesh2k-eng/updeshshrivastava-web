import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/supabase-posts";
import { getAllPosts } from "@/lib/posts";
import { getT } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and technical articles by Updesh Shrivastava on engineering, design, and building software.",
};

export const revalidate = 60; // ISR: refresh every 60 s

type ListPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string | null;
  source: "supabase" | "mdx";
};

export default async function WritingPage() {
  const [sbPosts, mdxPosts, t] = await Promise.all([
    getPublishedPosts().catch(() => []),
    Promise.resolve(getAllPosts()),
    getT(),
  ]);

  const supabaseSlugs = new Set(sbPosts.map((p) => p.slug));

  const combined: ListPost[] = [
    ...sbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.published_at ?? p.created_at,
      readTime: p.read_time,
      tags: p.tags ?? [],
      coverImage: p.cover_image ?? null,
      source: "supabase" as const,
    })),
    ...mdxPosts
      .filter((p) => !supabaseSlugs.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        readTime: p.readTime,
        tags: p.tags,
        coverImage: null,
        source: "mdx" as const,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">{t("writing.title")}</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          {t("writing.subtitle")}
        </p>
      </section>

      {/* Posts list */}
      {combined.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>{t("writing.noPosts")}</p>
      ) : (
        <div className="flex flex-col gap-0">
          {combined.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group flex items-start gap-5 py-7 border-t transition-opacity hover:opacity-75"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-base sm:text-lg mb-1.5 leading-snug group-hover:text-sky-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              {/* Thumbnail — cover image if available, gradient placeholder otherwise */}
              <div
                className="shrink-0 w-20 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full gradient-bg opacity-20" />
                )}
              </div>
            </Link>
          ))}
          <div className="border-t" style={{ borderColor: "var(--border)" }} />
        </div>
      )}
    </div>
  );
}
