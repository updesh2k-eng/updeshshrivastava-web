import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Writing",
  description: "Essays and technical articles by Updesh Shrivastava on engineering, design, and building software.",
};

export default async function WritingPage() {
  // Fetch published posts from Supabase
  const { data: posts, error } = await supabase
    .from("posts")
    .select("slug, title, date, excerpt, tags")
    .eq("status", "published")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">Writing</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Thoughts on engineering, design systems, developer experience, and the craft of
          building software.
        </p>
      </section>

      {!posts || posts.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No posts yet. Check back soon!</p>
      ) : (
        <div className="flex flex-col gap-0">
          {posts.map((post) => (
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
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.map((tag: string) => (
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
