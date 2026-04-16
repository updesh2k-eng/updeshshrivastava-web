"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminHeader, Spinner } from "./ui";

interface LIPost {
  id: string;
  embed_url: string;
  caption: string | null;
  published_at: string | null;
  display_order: number;
}

const BLANK_FORM = { embed_url: "", caption: "", published_at: "" };

/** Extract embed src from either a raw embed URL or pasted <iframe> HTML */
function extractEmbedUrl(raw: string): string {
  raw = raw.trim();
  // If pasted as <iframe src="...">
  const match = raw.match(/src="([^"]+linkedin\.com\/embed[^"]+)"/i);
  if (match) return match[1];
  // If it's a full LinkedIn post URL, convert to embed URL
  // https://www.linkedin.com/posts/username_slug-activityID-XXXX
  const activityMatch = raw.match(/activity[:-](\d+)/i);
  if (activityMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  const shareMatch = raw.match(/share[:-](\d+)/i);
  if (shareMatch) return `https://www.linkedin.com/embed/feed/update/urn:li:share:${shareMatch[1]}`;
  // Assume it's already an embed URL
  return raw;
}

export function LinkedInScreen({ onDone }: { onDone: () => void }) {
  const [posts, setPosts] = useState<LIPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("linkedin_posts")
      .select("id, embed_url, caption, published_at, display_order")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as LIPost[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.embed_url.trim()) { setError("Paste a LinkedIn post URL or embed code."); return; }

    const embedUrl = extractEmbedUrl(form.embed_url);
    if (!embedUrl.includes("linkedin.com")) {
      setError("That doesn't look like a LinkedIn URL. Paste the post URL or embed code from LinkedIn.");
      return;
    }

    setSaving(true);
    const { error: sbErr } = await supabase.from("linkedin_posts").insert([{
      embed_url: embedUrl,
      caption: form.caption.trim() || null,
      published_at: form.published_at || null,
      display_order: posts.length,
    }]);
    setSaving(false);
    if (sbErr) { setError(sbErr.message); return; }
    setForm(BLANK_FORM);
    setPreview(null);
    load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from("linkedin_posts").delete().eq("id", id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const next = [...posts];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setPosts(next);
    await Promise.all(next.map((p, i) =>
      supabase.from("linkedin_posts").update({ display_order: i }).eq("id", p.id)
    ));
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="LinkedIn Posts"
        left={
          <button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            <ArrowLeft size={15} />
          </button>
        }
      />

      <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-8">

        {/* Add form */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="font-bold text-sm mb-4">Add a LinkedIn post</h2>
          <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>
            On LinkedIn, open the post → click <strong>···</strong> → <strong>Embed this post</strong> → copy the URL from the iframe src attribute. Or paste the full LinkedIn post page URL — it will be converted automatically.
          </p>

          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Post URL or embed code *
              </label>
              <textarea
                rows={3}
                placeholder="https://www.linkedin.com/embed/feed/update/urn:li:share:... or paste full <iframe> code"
                value={form.embed_url}
                onChange={(e) => {
                  setForm((f) => ({ ...f, embed_url: e.target.value }));
                  const url = extractEmbedUrl(e.target.value);
                  setPreview(url.includes("linkedin.com/embed") ? url : null);
                }}
                className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors resize-none font-mono"
                style={inputStyle}
              />
            </div>

            {/* Live preview */}
            {preview && (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs px-3 py-1.5 font-semibold" style={{ color: "var(--muted)", background: "var(--background)" }}>Preview</p>
                <iframe
                  src={preview}
                  className="w-full"
                  style={{ height: "300px", border: "none" }}
                  title="LinkedIn post preview"
                  loading="lazy"
                />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Caption (optional)
                </label>
                <input
                  type="text"
                  maxLength={200}
                  placeholder="Short description shown below the post"
                  value={form.caption}
                  onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                  className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors"
                  style={inputStyle}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Post date (optional)
                </label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                  className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Plus size={14} />
                {saving ? "Saving..." : "Add post"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing posts */}
        <div>
          <h2 className="font-bold text-sm mb-4" style={{ color: "var(--muted)" }}>
            Saved posts ({posts.length})
          </h2>
          {loading ? (
            <Spinner />
          ) : posts.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No LinkedIn posts yet. Add one above.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((p, i) => (
                <div key={p.id} className="rounded-2xl border overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="shrink-0 p-1 rounded hover:opacity-60 transition-opacity disabled:opacity-20"
                        style={{ color: "var(--muted)" }}
                        title="Move up"
                      >
                        <GripVertical size={14} />
                      </button>
                      <p className="text-xs truncate font-mono" style={{ color: "var(--muted)" }}>{p.embed_url}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="shrink-0 p-1.5 rounded-lg hover:opacity-60 transition-opacity"
                      style={{ color: "#ef4444" }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {p.caption && (
                    <p className="px-4 py-2 text-xs" style={{ color: "var(--muted)" }}>{p.caption}</p>
                  )}
                  <iframe
                    src={p.embed_url}
                    className="w-full"
                    style={{ height: "280px", border: "none" }}
                    title={p.caption || "LinkedIn post"}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
