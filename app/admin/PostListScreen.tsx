"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminHeader, Spinner } from "./ui";
import type { SBPostRow } from "./types";

export function PostListScreen({
  pat,
  onLogout,
  onNew,
  onEdit,
  onBack,
}: {
  pat: string;
  onLogout: () => void;
  onNew: () => void;
  onEdit: (id: string) => void;
  onBack?: () => void;
}) {
  void pat;
  const [posts, setPosts] = useState<SBPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("posts")
        .select("id,slug,title,status,published_at,views,created_at")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setPosts((data ?? []) as SBPostRow[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(post: SBPostRow) {
    if (!confirm(`Delete "${post.title || post.slug}"? This cannot be undone.`)) return;
    setDeleting(post.id);
    try {
      const { error: err } = await supabase.from("posts").delete().eq("id", post.id);
      if (err) throw err;
      setPosts((p) => p.filter((x) => x.id !== post.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title={`Blog Posts — ${posts.length}`}
        left={
          <button onClick={onBack} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="Dashboard">
            <ArrowLeft size={15} />
          </button>
        }
        right={
          <>
            <button onClick={onNew} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity">
              <Plus size={13} /> New Post
            </button>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="Sign out">
              <LogOut size={13} />
            </button>
          </>
        }
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            {error} <button onClick={load} className="ml-3 underline">Retry</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>No posts yet.</p>
            <button onClick={onNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm gradient-bg text-white hover:opacity-90 transition-opacity">
              <Plus size={14} /> Create your first post
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            {posts.map((post) => {
              const busy = deleting === post.id;
              return (
                <div key={post.id} className="flex items-center justify-between px-5 py-4" style={{ borderColor: "var(--border)" }}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium truncate">{post.title || post.slug}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${post.status === "published" ? "border-green-500/40 text-green-400" : "border-orange-500/40 text-orange-400"}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                      /writing/{post.slug} · {post.views ?? 0} views
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <button onClick={() => onEdit(post.id)} className="p-2 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(post)} disabled={busy} className="p-2 rounded-lg transition-opacity disabled:opacity-40" style={{ color: "var(--muted)" }} title="Delete">
                      {busy ? <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" /> : <Trash2 size={14} className="hover:text-red-400 transition-colors" />}
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
