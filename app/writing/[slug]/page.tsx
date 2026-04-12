import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "@/components/MDXRemote";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      {/* Back link */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-60 transition-opacity"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} /> Back to Writing
      </Link>

      {/* Post header */}
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
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
          <time>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </header>

      <div className="w-full h-px mb-10" style={{ background: "var(--border)" }} />

      {/* MDX content */}
      <article className="prose max-w-none">
        <MDXRemote source={post.content} />
      </article>

      <div className="w-full h-px mt-16 mb-10" style={{ background: "var(--border)" }} />

      {/* Footer nav */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm hover:opacity-60 transition-opacity"
        style={{ color: "var(--muted)" }}
      >
        <ArrowLeft size={14} /> Back to all posts
      </Link>
    </div>
  );
}
