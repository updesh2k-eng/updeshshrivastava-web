import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostByIdAdmin } from "@/lib/supabase-posts";
import { ReadingProgress } from "@/components/ReadingProgress";

interface Props {
  params: Promise<{ id: string }>;
}

// Never cache — always fetch fresh from Supabase
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  const date = post.published_at ?? post.created_at;

  return (
    <>
      <ReadingProgress />

      {/* Draft banner */}
      <div className="sticky top-0 z-50 border-b px-5 py-2 flex items-center justify-between text-xs"
        style={{ background: "color-mix(in srgb, var(--background) 95%, orange)", borderColor: "var(--border)", color: "var(--muted)" }}>
        <span>
          <span className="font-semibold text-orange-400 mr-2">DRAFT PREVIEW</span>
          Status: <span className={post.status === "published" ? "text-green-400" : "text-orange-400"}>{post.status}</span>
          <span className="mx-2">·</span>
          This URL is only accessible if you have the link
        </span>
        <a
          href="/admin"
          className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity font-medium"
          style={{ color: "var(--foreground)" }}
        >
          ← Back to admin
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-60 transition-opacity"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={14} /> Back to Writing
        </Link>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full rounded-2xl mb-10 object-cover max-h-72"
          />
        )}

        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full border"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
            <time>
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.read_time}</span>
          </div>
        </header>

        <div className="w-full h-px mb-10" style={{ background: "var(--border)" }} />

        <article id="post-content" className="prose-post max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
        </article>

        <div className="w-full h-px mt-16 mb-10" style={{ background: "var(--border)" }} />

        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm hover:opacity-60 transition-opacity"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={14} /> Back to all posts
        </Link>
      </div>
    </>
  );
}
