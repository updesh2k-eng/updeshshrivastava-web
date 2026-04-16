"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Check, X, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminHeader, Spinner } from "./ui";

interface Comment {
  id: string;
  post_slug: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

type Tab = "pending" | "approved" | "rejected";

export function CommentsScreen({ onDone }: { onDone: () => void }) {
  const [tab, setTab] = useState<Tab>("pending");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionIds, setActionIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("id, post_slug, author_name, author_email, content, status, created_at")
      .eq("status", tab)
      .order("created_at", { ascending: false });
    if (!error) setComments((data ?? []) as Comment[]);
    setLoading(false);
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, newStatus: "approved" | "rejected") {
    setActionIds((prev) => new Set(prev).add(id));
    await supabase.from("comments").update({ status: newStatus }).eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setActionIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }

  async function deleteComment(id: string) {
    setActionIds((prev) => new Set(prev).add(id));
    await supabase.from("comments").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
    setActionIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending",  label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Comments"
        left={
          <button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            <ArrowLeft size={15} />
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={tab === t.id
                ? { background: "var(--background)", color: "var(--foreground)" }
                : { color: "var(--muted)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner />
        ) : comments.length === 0 ? (
          <p className="text-sm text-center py-16" style={{ color: "var(--muted)" }}>
            No {tab} comments.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((c) => {
              const busy = actionIds.has(c.id);
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border p-5"
                  style={{ background: "var(--card)", borderColor: "var(--border)", opacity: busy ? 0.5 : 1 }}
                >
                  {/* Meta */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm">{c.author_name}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{c.author_email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium gradient-text">/writing/{c.post_slug}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {new Date(c.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Comment body */}
                  <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap" style={{ color: "var(--muted)" }}>
                    {c.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {tab !== "approved" && (
                      <button
                        disabled={busy}
                        onClick={() => updateStatus(c.id, "approved")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.3)" }}
                      >
                        <Check size={12} /> Approve
                      </button>
                    )}
                    {tab !== "rejected" && (
                      <button
                        disabled={busy}
                        onClick={() => updateStatus(c.id, "rejected")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
                      >
                        <X size={12} /> Reject
                      </button>
                    )}
                    <button
                      disabled={busy}
                      onClick={() => deleteComment(c.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 ml-auto"
                      style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
