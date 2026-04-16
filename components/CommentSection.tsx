"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { submitPostComment, getPostComments, type PostComment } from "@/lib/supabase-posts";

function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getPostComments(slug).then(setComments).catch(() => {});
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitPostComment(slug, form.name, form.email, form.content);
      setStatus("sent");
      setForm({ name: "", email: "", content: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit comment. Please try again.");
    }
  }

  const iCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const iStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  return (
    <section className="mt-16">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare size={16} style={{ color: "var(--muted)" }} />
        <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Comments"}
        </h2>
      </div>

      {/* Comment list */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-6 mb-10">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 gradient-bg text-white"
              >
                {initials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold">{c.name}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.85 }}>
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      <div className="w-full h-px mb-8" style={{ background: "var(--border)" }} />

      {/* Submit form */}
      {status === "sent" ? (
        <div
          className="flex flex-col items-center gap-3 py-8 px-6 rounded-2xl border text-center"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-base">✓</div>
          <p className="font-semibold text-sm">Comment submitted!</p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            It will appear after moderation review.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-xs underline hover:opacity-70 transition-opacity mt-1"
            style={{ color: "var(--muted)" }}
          >
            Add another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold">Leave a comment</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your name *"
              className={iCls}
              style={iStyle}
            />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email (not published) *"
              className={iCls}
              style={iStyle}
            />
          </div>
          <textarea
            required
            rows={4}
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Share your thoughts…"
            className={iCls}
            style={{ ...iStyle, resize: "vertical" }}
          />
          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={13} />
            {status === "sending" ? "Submitting…" : "Post comment"}
          </button>
        </form>
      )}
    </section>
  );
}
