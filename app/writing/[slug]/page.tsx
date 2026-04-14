import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "@/components/MDXRemote";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // Fetch the specific post from Supabase
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <Link href="/writing" className="inline-flex items-center gap-2 text-sm mb-10 hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
        <ArrowLeft size={14} /> Back to Writing
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
          <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
        </div>
      </header>

      <div className="w-full h-px mb-10" style={{ background: "var(--border)" }} />

      <article className="prose max-w-none dark:prose-invert">
        {/* post.content is the Markdown string from Supabase */}
        <MDXRemote source={post.content} />
      </article>
    </div>
  );
}
