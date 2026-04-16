import { supabase } from "@/lib/supabase";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface Props {
  postSlug: string;
  labels?: {
    title: string;
    empty: string;
  };
}

const defaultLabels = {
  title: "Comments",
  empty: "No comments yet. Be the first to share your thoughts.",
};

async function getApprovedComments(slug: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, author_name, content, created_at")
    .eq("post_slug", slug)
    .eq("status", "approved")
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as Comment[];
}

export async function CommentList({ postSlug, labels }: Props) {
  const l = { ...defaultLabels, ...labels };
  const comments = await getApprovedComments(postSlug);

  return (
    <div>
      <h3 className="font-bold text-base mb-5">
        {l.title}
        {comments.length > 0 && (
          <span className="ml-2 text-sm font-normal gradient-text">({comments.length})</span>
        )}
      </h3>

      {comments.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>{l.empty}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border p-5"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  >
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm">{c.author_name}</span>
                </div>
                <time className="text-xs" style={{ color: "var(--muted)" }}>
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--muted)" }}>
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
