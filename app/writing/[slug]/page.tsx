import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/supabase-posts";
import { getAllPosts, getPostBySlug as getMdxPost } from "@/lib/posts";
import { MDXRemote } from "@/components/MDXRemote";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SocialShare } from "@/components/SocialShare";
import { ViewCounter } from "./ViewCounter";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const [sbPosts, mdxPosts] = await Promise.all([
    getPublishedPosts().catch(() => []),
    Promise.resolve(getAllPosts()),
  ]);
  const slugs = new Set([...sbPosts.map((p) => p.slug), ...mdxPosts.map((p) => p.slug)]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sbPost = await getPublishedPostBySlug(slug).catch(() => null);
  if (sbPost) {
    return {
      title: sbPost.title,
      description: sbPost.excerpt,
      openGraph: sbPost.cover_image ? { images: [sbPost.cover_image] } : undefined,
    };
  }
  const mdx = getMdxPost(slug);
  if (mdx) return { title: mdx.title, description: mdx.excerpt };
  return {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // Try Supabase first, fall back to MDX
  const sbPost = await getPublishedPostBySlug(slug).catch(() => null);
  const mdxPost = sbPost ? null : getMdxPost(slug);

  if (!sbPost && !mdxPost) notFound();

  const title = sbPost?.title ?? mdxPost!.title;
  const date = sbPost ? (sbPost.published_at ?? sbPost.created_at) : mdxPost!.date;
  const tags = sbPost?.tags ?? mdxPost!.tags;
  const readTime = sbPost?.read_time ?? mdxPost!.readTime;
  const postUrl = `https://updeshshrivastava.com/writing/${slug}`;

  return (
    <>
      {sbPost && <ViewCounter slug={slug} />}
      <ReadingProgress />
      <div className="max-w-2xl mx-auto px-6 py-20">
        {/* Back link */}
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-60 transition-opacity"
          style={{ color: "var(--muted)" }}
        >
          <ArrowLeft size={14} /> Back to Writing
        </Link>

        {/* Cover image */}
        {sbPost?.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sbPost.cover_image}
            alt={title}
            className="w-full rounded-2xl mb-10 object-cover max-h-72"
          />
        )}

        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
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
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
            <time>
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{readTime}</span>
            {sbPost && (
              <>
                <span>·</span>
                <span>{sbPost.views ?? 0} views</span>
              </>
            )}
          </div>
        </header>

        <div className="w-full h-px mb-10" style={{ background: "var(--border)" }} />

        {/* Content */}
        <article id="post-content" className="prose-post max-w-none">
          {sbPost ? (
            <div dangerouslySetInnerHTML={{ __html: sbPost.content_html }} />
          ) : (
            <MDXRemote source={mdxPost!.content} />
          )}
        </article>

        <div className="w-full h-px mt-16 mb-10" style={{ background: "var(--border)" }} />

        {/* Share */}
        <div className="mb-10">
          <SocialShare title={title} url={postUrl} />
        </div>

        {/* Footer nav */}
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
