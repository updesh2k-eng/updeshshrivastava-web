"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Save, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminHeader, Spinner } from "./ui";
import { toSlug } from "./mdx";
import type { SBForm } from "./types";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const EMPTY_SBFORM: SBForm = {
  title: "", slug: "", excerpt: "", tags: "",
  status: "draft", cover_image: "", read_time: "", content_html: "",
};

function estimateHtmlReadTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export function PostEditorScreen({
  pat,
  id: editId,
  onDone,
}: {
  pat: string;
  id?: string;
  onDone: () => void;
}) {
  void pat;
  const isEdit = !!editId;
  const [dbId, setDbId] = useState<string | null>(null);
  const [form, setForm] = useState<SBForm>(EMPTY_SBFORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEdit || !editId) return;
    (async () => {
      try {
        const { data, error: err } = await supabase.from("posts").select("*").eq("id", editId).single();
        if (err) throw err;
        setDbId(data.id);
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          tags: (data.tags ?? []).join(", "),
          status: data.status ?? "draft",
          cover_image: data.cover_image ?? "",
          read_time: data.read_time ?? "",
          content_html: data.content_html ?? "",
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, editId]);

  function field<K extends keyof SBForm>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, ...(!isEdit ? { slug: toSlug(title) } : {}) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug) return;
    setSaving(true);
    setError("");
    try {
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        tags,
        status: form.status,
        cover_image: form.cover_image || null,
        read_time: form.read_time || estimateHtmlReadTime(form.content_html),
        content_html: form.content_html,
        ...(form.status === "published" && !isEdit ? { published_at: new Date().toISOString() } : {}),
      };
      if (isEdit && dbId) {
        const { error: err } = await supabase.from("posts").update(payload).eq("id", dbId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("posts").insert([payload]);
        if (err) throw err;
      }
      setSaved(true);
      setTimeout(onDone, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };
  const labelCls = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "var(--muted)" };

  if (loading)
    return (
      <div className="min-h-screen" style={{ background: "var(--background)" }}>
        <AdminHeader title="Loading post…" />
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title={isEdit ? `Editing: ${form.title || editId}` : "New Post"}
        left={
          <button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            <ArrowLeft size={15} />
          </button>
        }
        right={
          <>
            <button onClick={onDone} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
              <X size={13} /> Cancel
            </button>
            <button
              form="post-form"
              type="submit"
              disabled={saving || saved}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={13} />
              {saved ? "Saved!" : saving ? "Saving…" : "Save"}
            </button>
          </>
        }
      />

      <form id="post-form" onSubmit={handleSave} className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-6">
        {error && <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">{error}</div>}
        {saved && <div className="text-sm text-green-400 p-4 rounded-xl border border-green-500/30 bg-green-500/10">Saved! Redirecting…</div>}

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Title *</label>
            <input type="text" value={form.title} onChange={handleTitleChange} required placeholder="Post title" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Slug *</label>
            <input type="text" value={form.slug} onChange={field("slug")} required placeholder="url-friendly-slug" className={inputCls} style={inputStyle} />
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>URL: /writing/{form.slug || "…"}</p>
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Excerpt *</label>
          <textarea value={form.excerpt} onChange={field("excerpt")} required rows={2} placeholder="Short description for the blog listing" className={inputCls} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Tags</label>
            <input type="text" value={form.tags} onChange={field("tags")} placeholder="AI, GDPR, Enterprise" className={inputCls} style={inputStyle} />
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Comma-separated</p>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Read time</label>
            <input type="text" value={form.read_time} onChange={field("read_time")} placeholder="auto-calculated" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Status</label>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, status: f.status === "published" ? "draft" : "published" }))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${form.status === "published" ? "border-green-500/40 text-green-400" : "border-orange-500/40 text-orange-400"}`}
              style={{ background: "var(--card)" }}
            >
              {form.status === "published" ? <Eye size={14} /> : <EyeOff size={14} />}
              {form.status === "published" ? "Published" : "Draft"}
            </button>
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Cover image URL <span className="normal-case font-normal">(optional)</span></label>
          <input type="url" value={form.cover_image} onChange={field("cover_image")} placeholder="https://…" className={inputCls} style={inputStyle} />
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Content</label>
          <Editor content={form.content_html} onChange={(html) => setForm((f) => ({ ...f, content_html: html }))} />
        </div>
      </form>
    </div>
  );
}
