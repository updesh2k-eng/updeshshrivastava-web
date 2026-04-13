"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, LogOut, Save, X } from "lucide-react";

// ── Constants ───────────────────────────────────────────────────────────────

const REPO = "updesh2k-eng/updeshshrivastava-web";
const POSTS_PATH = "content/posts";
const PAT_KEY = "ks-admin-pat";
const GH_API = "https://api.github.com";

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
    throw new Error(
      (err as { message?: string }).message ||
        `GitHub ${res.status}: ${res.statusText}`
    );
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
      const res = await fetch(`${GH_API}/user`, {
        headers: {
          Authorization: `token ${pat}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (!res.ok) throw new Error("Invalid token — check the PAT and its permissions.");
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
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
              Create a{" "}
              <a
                href="https://github.com/settings/tokens?type=beta"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70"
              >
                fine-grained token
              </a>{" "}
              for <strong>updesh2k-eng/updeshshrivastava-web</strong> with{" "}
              <strong>Contents: Read &amp; Write</strong>.
            </p>
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

// ── Post list ─────────────────────────────────────────────────────────────────

function PostListScreen({
  pat,
  onLogout,
  onNew,
  onEdit,
}: {
  pat: string;
  onLogout: () => void;
  onNew: () => void;
  onEdit: (slug: string) => void;
}) {
  const [posts, setPosts] = useState<GHFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await listPosts(pat));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [pat]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(post: GHFile) {
    const slug = post.name.replace(".mdx", "");
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      await deletePost(pat, slug, post.sha);
      setPosts((p) => p.filter((x) => x.sha !== post.sha));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title={`Blog Admin — ${posts.length} post${posts.length !== 1 ? "s" : ""}`}
        left={
          <Link
            href="/"
            className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
            style={{ color: "var(--muted)" }}
            title="Back to site"
          >
            <ArrowLeft size={15} />
          </Link>
        }
        right={
          <>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={13} /> New Post
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity"
              style={{ color: "var(--muted)" }}
              title="Sign out"
            >
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
            {error}
            <button onClick={load} className="ml-3 underline">
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              No posts yet.
            </p>
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Create your first post
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col divide-y rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {posts
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((post) => {
                const slug = post.name.replace(".mdx", "");
                const busy = deleting === slug;
                return (
                  <div
                    key={post.sha}
                    className="flex items-center justify-between px-5 py-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{slug}</p>
                      <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color: "var(--muted)" }}
                      >
                        {post.path}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button
                        onClick={() => onEdit(slug)}
                        className="p-2 rounded-lg hover:opacity-60 transition-opacity"
                        style={{ color: "var(--muted)" }}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        disabled={busy}
                        className="p-2 rounded-lg transition-opacity disabled:opacity-40"
                        style={{ color: "var(--muted)" }}
                        title="Delete"
                      >
                        {busy ? (
                          <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} className="hover:text-red-400 transition-colors" />
                        )}
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

// ── Post editor ───────────────────────────────────────────────────────────────

const EMPTY_FORM: PostFields = {
  title: "",
  date: new Date().toISOString().split("T")[0],
  excerpt: "",
  tags: "",
  readTime: "",
  content: "",
};

function PostEditorScreen({
  pat,
  slug: editSlug,
  onDone,
}: {
  pat: string;
  slug?: string;
  onDone: () => void;
}) {
  const isEdit = !!editSlug;
  const [sha, setSha] = useState("");
  const [form, setForm] = useState<PostFields>(EMPTY_FORM);
  const [slugField, setSlugField] = useState(editSlug ?? "");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { raw, sha: fileSha } = await readPost(pat, editSlug!);
        setSha(fileSha);
        setForm(parseMdx(raw));
        setSlugField(editSlug!);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, editSlug, pat]);

  function set<K extends keyof PostFields>(key: K) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((f) => ({ ...f, title }));
    if (!isEdit) setSlugField(toSlug(title));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!slugField) return;
    setSaving(true);
    setError("");
    try {
      const raw = buildMdx(form);
      await writePost(pat, slugField, raw, sha || undefined);
      setSaved(true);
      setTimeout(onDone, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const inputStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };
  const labelCls =
    "block text-xs font-semibold uppercase tracking-wider mb-1.5";
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
        title={isEdit ? `Editing: ${editSlug}` : "New Post"}
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
            <label className={labelCls} style={labelStyle}>
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              required
              placeholder="Post title"
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>
              Slug (filename) *
            </label>
            <input
              type="text"
              value={slugField}
              onChange={(e) => setSlugField(e.target.value)}
              required
              placeholder="url-friendly-slug"
              className={inputCls}
              style={inputStyle}
            />
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              File will be saved as <code>content/posts/{slugField || "…"}.mdx</code>
            </p>
          </div>
        </div>

        {/* Date + Read Time */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>
              Date *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={set("date")}
              required
              className={inputCls}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>
              Read Time
            </label>
            <input
              type="text"
              value={form.readTime}
              onChange={set("readTime")}
              placeholder="5 min read"
              className={inputCls}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelCls} style={labelStyle}>
            Excerpt *
          </label>
          <textarea
            value={form.excerpt}
            onChange={set("excerpt")}
            required
            rows={2}
            placeholder="Short description shown on the blog listing page"
            className={inputCls}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className={labelCls} style={labelStyle}>
            Tags
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={set("tags")}
            placeholder="AI, GDPR, Enterprise"
            className={inputCls}
            style={inputStyle}
          />
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
            Comma-separated
          </p>
        </div>

        {/* Content */}
        <div>
          <label className={labelCls} style={labelStyle}>
            Content (Markdown / MDX)
          </label>
          <textarea
            value={form.content}
            onChange={set("content")}
            rows={24}
            placeholder="Write your post here…"
            className={`${inputCls} font-mono text-xs leading-relaxed`}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>
      </form>
    </div>
  );
}

// ── Root page ─────────────────────────────────────────────────────────────────

type View =
  | { name: "login" }
  | { name: "list" }
  | { name: "new" }
  | { name: "edit"; slug: string };

export default function AdminPage() {
  const [pat, setPat] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "login" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PAT_KEY);
    if (stored) {
      setPat(stored);
      setView({ name: "list" });
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleLogin(token: string) {
    setPat(token);
    setView({ name: "list" });
  }

  function handleLogout() {
    localStorage.removeItem(PAT_KEY);
    setPat(null);
    setView({ name: "login" });
  }

  if (!pat || view.name === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (view.name === "new") {
    return (
      <PostEditorScreen
        pat={pat}
        onDone={() => setView({ name: "list" })}
      />
    );
  }

  if (view.name === "edit") {
    return (
      <PostEditorScreen
        pat={pat}
        slug={view.slug}
        onDone={() => setView({ name: "list" })}
      />
    );
  }

  return (
    <PostListScreen
      pat={pat}
      onLogout={handleLogout}
      onNew={() => setView({ name: "new" })}
      onEdit={(slug) => setView({ name: "edit", slug })}
    />
  );
}
