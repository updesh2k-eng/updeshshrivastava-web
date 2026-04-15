import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
              className="group flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-8 border-t transition-opacity hover:opacity-70"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1.5 leading-snug">{post.title}</h2>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {post.readTime}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                style={{ color: "var(--muted)" }}
              />
            </Link>
          ))}
          <div className="border-t" style={{ borderColor: "var(--border)" }} />
        </div>
      )}
    </div>
  );
}
