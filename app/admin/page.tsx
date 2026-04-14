"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, LogOut, Save, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

// ── Constants ───────────────────────────────────────────────────────────────

const REPO = "updesh2k-eng/updeshshrivastava-web";
const POSTS_PATH = "content/posts";
const CONFIG_PATH = "content/config.json";
const PAT_KEY = "ks-admin-pat";
const GH_API = "https://api.github.com";

// ── Site config types (mirrors lib/config.ts, no fs import) ─────────────────

interface NavLink { href: string; label: string; visible: boolean }
interface FeaturedProject { title: string; description: string; tags: string[]; href: string }
interface SiteConfig {
  brand: { name: string; tagline: string };
  nav: NavLink[];
  home: {
    badge: string; headline: string; subheadline: string;
    proofPoints: string[];
    social: { github: string; twitter: string; linkedin: string };
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    featuredWork: FeaturedProject[];
    ctaSection: { title: string; description: string; buttonLabel: string; buttonHref: string };
  };
}

// ── GitHub API helpers ───────────────────────────────────────────────────────

type GHFile = { name: string; sha: string; path: string };
type GHContent = { sha: string; content: string };

async function ghFetch(path: string, pat: string, init?: RequestInit) {
  return fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
}

function ghWriteError(msg: string): Error {
  if (/not accessible by personal access token/i.test(msg) || /resource not accessible/i.test(msg)) {
    return new Error(
      "Token lacks write access. Sign out, then create a new Classic token at github.com/settings/tokens/new — tick the 'repo' checkbox."
    );
  }
  return new Error(msg);
}

async function listPosts(pat: string): Promise<GHFile[]> {
  const res = await ghFetch(`/repos/${REPO}/contents/${POSTS_PATH}`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).filter((f: GHFile) =>
    f.name.endsWith(".mdx")
  );
}

async function readPost(
  pat: string,
  slug: string
): Promise<{ raw: string; sha: string }> {
  const res = await ghFetch(
    `/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`,
    pat
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data: GHContent = await res.json();
  // GitHub returns base64 with line breaks
  const raw = decodeURIComponent(
    escape(atob(data.content.replace(/\s/g, "")))
  );
  return { raw, sha: data.sha };
}

async function writePost(
  pat: string,
  slug: string,
  raw: string,
  sha?: string
) {
  const content = btoa(unescape(encodeURIComponent(raw)));
  const body: Record<string, string> = {
    message: sha ? `feat: update post "${slug}"` : `feat: add post "${slug}"`,
    content,
  };
  if (sha) body.sha = sha;
  const res = await ghFetch(
    `/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`,
    pat,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}: ${res.statusText}`);
  }
}

// ── Config helpers ───────────────────────────────────────────────────────────

async function readConfig(pat: string): Promise<{ config: SiteConfig; sha: string }> {
  const res = await ghFetch(`/repos/${REPO}/contents/${CONFIG_PATH}`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data: GHContent = await res.json();
  const raw = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
  return { config: JSON.parse(raw) as SiteConfig, sha: data.sha };
}

async function writeConfig(pat: string, config: SiteConfig, sha: string) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(config, null, 2))));
  const res = await ghFetch(`/repos/${REPO}/contents/${CONFIG_PATH}`, pat, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "chore: update site config", content, sha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}`);
  }
}

// ── Image helpers ────────────────────────────────────────────────────────────

async function listImages(pat: string): Promise<GHFile[]> {
  const res = await ghFetch(`/repos/${REPO}/contents/public`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).filter((f: GHFile) =>
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(f.name)
  );
}

async function uploadImage(pat: string, path: string, base64: string, sha?: string) {
  const res = await ghFetch(`/repos/${REPO}/contents/public/${path}`, pat, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore: update image ${path}`,
      content: base64,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}`);
  }
}

async function deletePost(pat: string, slug: string, sha: string) {
  const res = await ghFetch(
    `/repos/${REPO}/contents/${POSTS_PATH}/${slug}.mdx`,
    pat,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `chore: remove post "${slug}"`,
        sha,
      }),
    }
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
}

// ── MDX helpers ──────────────────────────────────────────────────────────────

interface PostFields {
  title: string;
  date: string;
  excerpt: string;
  tags: string; // comma-separated for the form
  readTime: string;
  content: string;
}

function buildMdx(f: PostFields): string {
  const tagList = f.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tagsYaml = `[${tagList.map((t) => `"${t}"`).join(", ")}]`;
  return [
    "---",
    `title: "${f.title.replace(/"/g, '\\"')}"`,
    `date: "${f.date}"`,
    `excerpt: "${f.excerpt.replace(/"/g, '\\"')}"`,
    `tags: ${tagsYaml}`,
    `readTime: "${f.readTime}"`,
    "---",
    "",
    f.content,
  ].join("\n");
}

function parseMdx(raw: string): PostFields {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) return { title: "", date: "", excerpt: "", tags: "", readTime: "", content: raw };

  const yaml = fmMatch[1];
  const content = fmMatch[2].trimStart();

  const str = (key: string) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "m"));
    return m ? m[1].replace(/\\"/g, '"') : "";
  };
  const tagStr = () => {
    const m = yaml.match(/^tags:\s*\[([^\]]*)\]/m);
    if (!m) return "";
    return m[1]
      .split(",")
      .map((t) => t.trim().replace(/^"|"$/g, ""))
      .join(", ");
  };

  return {
    title: str("title"),
    date: str("date"),
    excerpt: str("excerpt"),
    tags: tagStr(),
    readTime: str("readTime"),
    content,
  };
}

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 rounded-full animate-spin border-sky-500 border-t-transparent" />
    </div>
  );
}

function AdminHeader({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-10 border-b px-5 h-14 flex items-center justify-between"
      style={{
        borderColor: "var(--border)",
        background: "var(--background)",
      }}
    >
      <div className="flex items-center gap-3">
        {left}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

// ── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pat: string) => void }) {
  const [pat, setPat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 1. Validate the token itself
      const userRes = await fetch(`${GH_API}/user`, {
        headers: { Authorization: `token ${pat}`, Accept: "application/vnd.github+json" },
      });
      if (!userRes.ok) throw new Error("Invalid token — it may be expired or malformed.");

      // 2. Test repo read + write access by checking repo permissions
      const repoRes = await fetch(`${GH_API}/repos/${REPO}`, {
        headers: { Authorization: `token ${pat}`, Accept: "application/vnd.github+json" },
      });
      if (!repoRes.ok) throw new Error("Token cannot access the repository. Check you selected the right repo when creating the token.");
      const repoData = await repoRes.json() as { permissions?: { push?: boolean } };
      if (repoData.permissions && repoData.permissions.push === false) {
        throw new Error("Token has read-only access. You need write (push) permission on the repository.");
      }

      localStorage.setItem(PAT_KEY, pat);
      onLogin(pat);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Blog Admin</h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--muted)" }}>
          Sign in with a GitHub Personal Access Token
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              GitHub PAT
            </label>
            <input
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="ghp_…"
              required
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
            <div className="mt-2 text-xs rounded-xl border p-3 flex flex-col gap-2" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>Recommended: Classic token (simpler)</p>
              <p>
                <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
                  github.com/settings/tokens/new
                </a>
                {" "}→ tick the <strong>repo</strong> checkbox → Generate.
              </p>
              <p className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Or: Fine-grained token</span>
                {" "}→ Repository: <strong>updeshshrivastava-web</strong> → Permissions → Contents: <strong>Read &amp; Write</strong>.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pat}
            className="py-3 rounded-xl font-medium text-sm gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
          <Link href="/" className="underline hover:opacity-70">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Post list (Supabase) ──────────────────────────────────────────────────────

type SBPostRow = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  published_at: string | null;
  views: number;
  created_at: string;
};

function PostListScreen({
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
  void pat; // pat still used by other screens; keep in props for consistency
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

// ── Post editor (Supabase) ────────────────────────────────────────────────────

interface SBForm {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  status: "draft" | "published";
  cover_image: string;
  read_time: string;
  content_html: string;
}

const EMPTY_SBFORM: SBForm = {
  title: "", slug: "", excerpt: "", tags: "",
  status: "draft", cover_image: "", read_time: "", content_html: "",
};

function estimateHtmlReadTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function PostEditorScreen({
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
          <button
            onClick={onDone}
            className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            <ArrowLeft size={15} />
          </button>
        }
        right={
          <>
            <button
              onClick={onDone}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity"
              style={{ color: "var(--muted)" }}
            >
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

      <form
        id="post-form"
        onSubmit={handleSave}
        className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-6"
      >
        {error && (
          <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
            {error}
          </div>
        )}
        {saved && (
          <div className="text-sm text-green-400 p-4 rounded-xl border border-green-500/30 bg-green-500/10">
            Saved! Redirecting…
          </div>
        )}

        {/* Title + Slug */}
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

        {/* Excerpt */}
        <div>
          <label className={labelCls} style={labelStyle}>Excerpt *</label>
          <textarea value={form.excerpt} onChange={field("excerpt")} required rows={2} placeholder="Short description for the blog listing" className={inputCls} style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* Tags + Read Time + Status */}
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

        {/* Cover image */}
        <div>
          <label className={labelCls} style={labelStyle}>Cover image URL <span className="normal-case font-normal">(optional)</span></label>
          <input type="url" value={form.cover_image} onChange={field("cover_image")} placeholder="https://…" className={inputCls} style={inputStyle} />
        </div>

        {/* Rich text editor */}
        <div>
          <label className={labelCls} style={labelStyle}>Content</label>
          <Editor content={form.content_html} onChange={(html) => setForm((f) => ({ ...f, content_html: html }))} />
        </div>
      </form>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardScreen({
  pat,
  onLogout,
  onNav,
}: {
  pat: string;
  onLogout: () => void;
  onNav: (dest: string) => void;
}) {
  const cards = [
    { id: "posts",  label: "Blog Posts",    desc: "Create, edit, delete posts",        icon: "✍️" },
    { id: "nav",    label: "Navigation",    desc: "Rename & reorder menu links",        icon: "🔗" },
    { id: "home",   label: "Home Page",     desc: "Hero text, proof points, social",    icon: "🏠" },
    { id: "images", label: "Images",        desc: "Upload & replace site images",       icon: "🖼️" },
  ];
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Site Admin"
        left={<Link href="/" className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="View site"><ArrowLeft size={15} /></Link>}
        right={<button onClick={onLogout} className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="Sign out"><LogOut size={13} /></button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <p className="text-xs mb-6 uppercase tracking-widest font-semibold" style={{ color: "var(--muted)" }}>What would you like to manage?</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => onNav(c.id)}
              className="group text-left p-5 rounded-2xl border transition-all duration-200 hover:border-sky-500/50"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="text-2xl mb-3">{c.icon}</div>
              <p className="font-semibold text-sm mb-1">{c.label}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Navigation editor ─────────────────────────────────────────────────────────

function NavEditorScreen({ pat, onDone }: { pat: string; onDone: () => void }) {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [sha, setSha] = useState("");
  const [fullConfig, setFullConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { config, sha: s } = await readConfig(pat);
        setFullConfig(config);
        setLinks(config.nav);
        setSha(s);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load config");
      } finally { setLoading(false); }
    })();
  }, [pat]);

  function move(i: number, dir: -1 | 1) {
    setLinks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function handleSave() {
    if (!fullConfig) return;
    setSaving(true); setError("");
    try {
      await writeConfig(pat, { ...fullConfig, nav: links }, sha);
      setSaved(true);
      setTimeout(onDone, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  if (loading) return <div className="min-h-screen" style={{ background: "var(--background)" }}><AdminHeader title="Navigation" /><Spinner /></div>;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Navigation"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <button onClick={handleSave} disabled={saving || saved} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 disabled:opacity-50">
            <Save size={13} />{saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        }
      />
      <div className="max-w-xl mx-auto px-5 py-10 flex flex-col gap-4">
        {error && <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">{error}</div>}
        <p className="text-xs" style={{ color: "var(--muted)" }}>Edit labels, toggle visibility, and reorder items. The URL paths cannot be changed here.</p>
        <div className="flex flex-col gap-2">
          {links.map((link, i) => (
            <div key={link.href} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-0.5 hover:opacity-60 disabled:opacity-20 transition-opacity" style={{ color: "var(--muted)" }}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === links.length - 1} className="p-0.5 hover:opacity-60 disabled:opacity-20 transition-opacity" style={{ color: "var(--muted)" }}>▼</button>
              </div>
              <input
                type="text"
                value={link.label}
                onChange={(e) => setLinks((prev) => prev.map((l, j) => j === i ? { ...l, label: e.target.value } : l))}
                className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:border-sky-500 transition-colors"
                style={inputStyle}
              />
              <code className="text-xs px-2" style={{ color: "var(--muted)" }}>{link.href}</code>
              <button
                onClick={() => setLinks((prev) => prev.map((l, j) => j === i ? { ...l, visible: !l.visible } : l))}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${link.visible ? "border-sky-500/50 text-sky-400" : ""}`}
                style={link.visible ? {} : { borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {link.visible ? "Visible" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home page editor ──────────────────────────────────────────────────────────

function HomeEditorScreen({ pat, onDone }: { pat: string; onDone: () => void }) {
  type HomeConfig = SiteConfig["home"];
  const [home, setHome] = useState<HomeConfig | null>(null);
  const [sha, setSha] = useState("");
  const [fullConfig, setFullConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"hero" | "work" | "cta">("hero");

  useEffect(() => {
    (async () => {
      try {
        const { config, sha: s } = await readConfig(pat);
        setFullConfig(config); setHome(config.home); setSha(s);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load config");
      } finally { setLoading(false); }
    })();
  }, [pat]);

  async function handleSave() {
    if (!fullConfig || !home) return;
    setSaving(true); setError("");
    try {
      await writeConfig(pat, { ...fullConfig, home }, sha);
      setSaved(true); setTimeout(onDone, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  const iStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };
  const iCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const lCls = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const lStyle = { color: "var(--muted)" };

  if (loading) return <div className="min-h-screen" style={{ background: "var(--background)" }}><AdminHeader title="Home Page" /><Spinner /></div>;
  if (!home) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Home Page"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <button onClick={handleSave} disabled={saving || saved} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 disabled:opacity-50">
            <Save size={13} />{saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        }
      />

      {/* Tabs */}
      <div className="border-b px-5 flex gap-1" style={{ borderColor: "var(--border)" }}>
        {(["hero", "work", "cta"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold capitalize transition-colors ${tab === t ? "border-b-2 border-sky-500 text-sky-400" : "hover:opacity-70"}`}
            style={tab !== t ? { color: "var(--muted)" } : {}}
          >{t === "work" ? "Featured Work" : t === "cta" ? "CTA Section" : "Hero"}</button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-5">
        {error && <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">{error}</div>}

        {tab === "hero" && (
          <>
            <div><label className={lCls} style={lStyle}>Badge text</label>
              <input className={iCls} style={iStyle} value={home.badge} onChange={(e) => setHome({ ...home, badge: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Headline</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={home.headline} onChange={(e) => setHome({ ...home, headline: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Subheadline</label>
              <input className={iCls} style={iStyle} value={home.subheadline} onChange={(e) => setHome({ ...home, subheadline: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Proof Points <span className="normal-case font-normal">(one per line)</span></label>
              <textarea className={`${iCls} font-mono text-xs`} style={{ ...iStyle, resize: "vertical" }} rows={4}
                value={home.proofPoints.join("\n")}
                onChange={(e) => setHome({ ...home, proofPoints: e.target.value.split("\n").filter(Boolean) })} /></div>
            <div className="grid sm:grid-cols-3 gap-3">
              {(["github", "twitter", "linkedin"] as const).map((k) => (
                <div key={k}><label className={lCls} style={lStyle}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                  <input className={iCls} style={iStyle} value={home.social[k]}
                    onChange={(e) => setHome({ ...home, social: { ...home.social, [k]: e.target.value } })} /></div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={lCls} style={lStyle}>Primary CTA label</label>
                <input className={iCls} style={iStyle} value={home.ctaPrimary.label}
                  onChange={(e) => setHome({ ...home, ctaPrimary: { ...home.ctaPrimary, label: e.target.value } })} /></div>
              <div><label className={lCls} style={lStyle}>Secondary CTA label</label>
                <input className={iCls} style={iStyle} value={home.ctaSecondary.label}
                  onChange={(e) => setHome({ ...home, ctaSecondary: { ...home.ctaSecondary, label: e.target.value } })} /></div>
            </div>
          </>
        )}

        {tab === "work" && home.featuredWork.map((proj, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Project {i + 1}</p>
            <div><label className={lCls} style={lStyle}>Title</label>
              <input className={iCls} style={iStyle} value={proj.title}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], title: e.target.value }; setHome({ ...home, featuredWork: fw }); }} /></div>
            <div><label className={lCls} style={lStyle}>Description</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={proj.description}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], description: e.target.value }; setHome({ ...home, featuredWork: fw }); }} /></div>
            <div><label className={lCls} style={lStyle}>Tags <span className="normal-case font-normal">(comma-separated)</span></label>
              <input className={iCls} style={iStyle} value={proj.tags.join(", ")}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }; setHome({ ...home, featuredWork: fw }); }} /></div>
          </div>
        ))}

        {tab === "cta" && (
          <>
            <div><label className={lCls} style={lStyle}>Title</label>
              <input className={iCls} style={iStyle} value={home.ctaSection.title} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, title: e.target.value } })} /></div>
            <div><label className={lCls} style={lStyle}>Description</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={home.ctaSection.description} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, description: e.target.value } })} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={lCls} style={lStyle}>Button label</label>
                <input className={iCls} style={iStyle} value={home.ctaSection.buttonLabel} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, buttonLabel: e.target.value } })} /></div>
              <div><label className={lCls} style={lStyle}>Button link</label>
                <input className={iCls} style={iStyle} value={home.ctaSection.buttonHref} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, buttonHref: e.target.value } })} /></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Images manager ────────────────────────────────────────────────────────────

function ImagesScreen({ pat, onDone }: { pat: string; onDone: () => void }) {
  const [images, setImages] = useState<GHFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try { setImages(await listImages(pat)); }
      catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load images"); }
      finally { setLoading(false); }
    })();
  }, [pat]);

  async function handleUpload(file: File, existing?: GHFile) {
    const name = existing ? existing.name : file.name;
    setUploading(name); setError(""); setSuccess("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await uploadImage(pat, name, base64, existing?.sha);
      setSuccess(`${name} uploaded — site will update after Vercel rebuilds.`);
      // refresh list
      setImages(await listImages(pat));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally { setUploading(null); }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Images"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 cursor-pointer">
            <Plus size={13} /> Upload new
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
          </label>
        }
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        {error && <div className="text-sm text-red-400 p-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">{error}</div>}
        {success && <div className="text-sm text-green-400 p-3 rounded-xl border border-green-500/30 bg-green-500/10 mb-4">{success}</div>}
        {loading ? <Spinner /> : (
          <div className="grid sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.sha} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="h-32 flex items-center justify-center p-4 bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://raw.githubusercontent.com/${REPO}/main/public/${img.name}?t=${Date.now()}`}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{img.name}</span>
                  <label className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer hover:opacity-70 transition-opacity ${uploading === img.name ? "opacity-40 pointer-events-none" : ""}`}
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                    {uploading === img.name ? "Uploading…" : "Replace"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, img); e.target.value = ""; }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-center" style={{ color: "var(--muted)" }}>
          Images are served from <code>public/</code>. Uploading commits to GitHub and Vercel rebuilds automatically.
        </p>
      </div>
    </div>
  );
}

// ── Root page ─────────────────────────────────────────────────────────────────

type View =
  | { name: "login" }
  | { name: "dashboard" }
  | { name: "posts" }
  | { name: "new" }
  | { name: "edit"; id: string }
  | { name: "nav" }
  | { name: "home" }
  | { name: "images" };

export default function AdminPage() {
  const [pat, setPat] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "login" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PAT_KEY);
    if (stored) { setPat(stored); setView({ name: "dashboard" }); }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleLogin(token: string) { setPat(token); setView({ name: "dashboard" }); }
  function handleLogout() { localStorage.removeItem(PAT_KEY); setPat(null); setView({ name: "login" }); }

  if (!pat || view.name === "login") return <LoginScreen onLogin={handleLogin} />;

  if (view.name === "dashboard") return (
    <DashboardScreen pat={pat} onLogout={handleLogout}
      onNav={(dest) => {
        if (dest === "posts") setView({ name: "posts" });
        else if (dest === "nav") setView({ name: "nav" });
        else if (dest === "home") setView({ name: "home" });
        else if (dest === "images") setView({ name: "images" });
      }} />
  );

  if (view.name === "posts") return (
    <PostListScreen pat={pat} onLogout={handleLogout}
      onBack={() => setView({ name: "dashboard" })}
      onNew={() => setView({ name: "new" })}
      onEdit={(id) => setView({ name: "edit", id })} />
  );

  if (view.name === "new") return (
    <PostEditorScreen pat={pat} onDone={() => setView({ name: "posts" })} />
  );

  if (view.name === "edit") return (
    <PostEditorScreen pat={pat} id={view.id} onDone={() => setView({ name: "posts" })} />
  );

  if (view.name === "nav") return (
    <NavEditorScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );

  if (view.name === "home") return (
    <HomeEditorScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );

  if (view.name === "images") return (
    <ImagesScreen pat={pat} onDone={() => setView({ name: "dashboard" })} />
  );

  return null;
}
