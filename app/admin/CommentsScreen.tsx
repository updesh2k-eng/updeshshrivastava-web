"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { getAllCommentsAdmin, approveComment, deleteComment, type PostComment } from "@/lib/supabase-posts";
import { AdminHeader, Spinner } from "./ui";

function timeAgo(iso: string) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CommentsScreen({ onBack }: { onBack: () => void }) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setComments(await getAllCommentsAdmin());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id: string) {
    setActionId(id);
    try {
      await approveComment(id);
      setComments((cs) => cs.map((c) => c.id === id ? { ...c, approved: true } : c));
    } catch {
      // silent — keep row visible
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    setActionId(id);
    try {
      await deleteComment(id);
      setComments((cs) => cs.filter((c) => c.id !== id));
    } catch {
      // silent
    } finally {
      setActionId(null);
    }
  }

  const pending = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Comments"
        left={
          <button onClick={onBack} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            <ArrowLeft size={15} />
          </button>
        }
        right={
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "var(--card)", color: "var(--muted)" }}>
            {pending.length} pending
          </span>
        }
      />

      <div className="max-w-2xl mx-auto px-5 py-8">
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">{error}</div>
        )}

        {loading ? <Spinner /> : (
          <>
            {/* Pending */}
            {pending.length > 0 && (
              <section className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
                  Awaiting approval ({pending.length})
                </p>
                <div className="flex flex-col gap-3">
                  {pending.map((c) => (
                    <CommentRow key={c.id} comment={c} actionId={actionId} onApprove={handleApprove} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}

            {/* Approved */}
            {approved.length > 0 && (
              <section>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
                  Published ({approved.length})
                </p>
                <div className="flex flex-col gap-3">
                  {approved.map((c) => (
                    <CommentRow key={c.id} comment={c} actionId={actionId} onApprove={handleApprove} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}

            {comments.length === 0 && (
              <p className="text-sm text-center py-16" style={{ color: "var(--muted)" }}>No comments yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CommentRow({
  comment: c,
  actionId,
  onApprove,
  onDelete,
}: {
  comment: PostComment;
  actionId: string | null;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const busy = actionId === c.id;
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ borderColor: c.approved ? "var(--border)" : "rgb(234 179 8 / 0.3)", background: "var(--card)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
            <span className="text-sm font-semibold">{c.name}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{c.email}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{timeAgo(c.created_at)}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>·</span>
            <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>/writing/{c.post_slug}</span>
          </div>
          <p className="text-sm leading-relaxed">{c.content}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {!c.approved && (
            <button
              onClick={() => onApprove(c.id)}
              disabled={busy}
              title="Approve"
              className="p-1.5 rounded-lg text-green-500 hover:bg-green-500/10 transition-colors disabled:opacity-40"
            >
              <Check size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(c.id)}
            disabled={busy}
            title="Delete"
            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
