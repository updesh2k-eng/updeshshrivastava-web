"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, LogOut, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

// -- Types --

interface Post {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: any; 
  status: "draft" | "published";
}

// -- Shared UI Components --

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 rounded-full animate-spin border-sky-500 border-t-transparent" />
    </div>
  );
}

function AdminHeader({ title, left, right }: { title: string; left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b px-5 h-14 flex items-center justify-between bg-[var(--background)] border-[var(--border)]">
      <div className="flex items-center gap-3">
        {left}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}

// -- Screens --

function DashboardScreen({ onLogout, setView }: { onLogout: () => void, setView: (v: string) => void }) {
  const cards = [
    { id: "posts", label: "Blog Posts", desc: "Manage database-backed posts", icon: "✍️" },
    { id: "images", label: "Images", desc: "Upload to Supabase Storage", icon: "🖼️" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader 
        title="Site Admin (Supabase)" 
        left={<Link href="/" className="p-1.5 rounded-lg hover:opacity-60"><ArrowLeft size={15} /></Link>}
        right={<button onClick={onLogout} className="p-1.5 rounded-lg hover:opacity-60"><LogOut size={13} /></button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <button key={c.id} onClick={() => setView(c.id)} className="text-left p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-sky-500/50 transition-all">
              <div className="text-2xl mb-3">{c.icon}</div>
              <p className="font-semibold text-sm mb-1">{c.label}</p>
              <p className="text-xs text-[var(--muted)]">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostListScreen({ onEdit, onNew, onBack }: { onEdit: (p: Post) => void, onNew: () => void, onBack: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("posts").select("*").order("date", { ascending: false });
    if (!error && data) setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function deletePost(id: string) {
    if (!confirm("Delete post?")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader 
        title="Posts" 
        left={<button onClick={onBack} className="p-1.5"><ArrowLeft size={15} /></button>}
        right={<button onClick={onNew} className="px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white"><Plus size={13} className="inline mr-1" /> New Post</button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        {loading ? <Spinner /> : (
          <div className="flex flex-col border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
            {posts.length === 0 ? (
                <p className="p-10 text-center text-sm text-[var(--muted)]">No database posts found.</p>
            ) : posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-[var(--muted)]">{post.date} • {post.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(post)} className="p-2 hover:text-sky-500"><Pencil size={14} /></button>
                  <button onClick={() => deletePost(post.id!)} className="p-2 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostEditorScreen({ post, onDone }: { post?: Post, onDone: () => void }) {
  const [form, setForm] = useState<Partial<Post>>(post || {
    title: "",
    slug: "",
    date: new Date().toISOString().split('T')[0],
    status: "draft",
    tags: [],
    content: "" 
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const postData = { ...form, tags: Array.isArray(form.tags) ? form.tags : [] };
    
    const { error } = post?.id 
      ? await supabase.from("posts").update(postData).eq("id", post.id)
      : await supabase.from("posts").insert([postData]);

    if (error) alert(error.message);
    else onDone();
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader 
        title={post ? "Edit Post" : "New Post"} 
        left={<button onClick={onDone} className="p-1.5"><ArrowLeft size={15} /></button>}
        right={<button onClick={handleSave} disabled={saving} className="px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white"><Save size={13} className="inline mr-1" /> Save</button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10 flex flex-col gap-6">
        <input 
          className="text-2xl font-bold bg-transparent border-none outline-none placeholder:opacity-30" 
          placeholder="Post Title" 
          value={form.title} 
          onChange={e => setForm({...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} 
        />
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="p-2 rounded bg-[var(--card)] border border-[var(--border)] text-sm" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <select className="p-2 rounded bg-[var(--card)] border border-[var(--border)] text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <textarea 
          className="w-full h-64 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-mono" 
          placeholder="Content..." 
          value={typeof form.content === 'string' ? form.content : JSON.stringify(form.content, null, 2)}
          onChange={e => setForm({...form, content: e.target.value})}
        />
      </div>
    </div>
  );
}

// -- Main Component --

export default function AdminPage() {
  const [view, setView] = useState("dashboard");
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const pat = localStorage.getItem("ks-admin-pat");
    if (pat) setIsAuthenticated(true);
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isAuthenticated) return (
    <div className="p-20 text-center">
        <p className="mb-4">Please log in via the original admin flow first.</p>
        <Link href="/" className="underline text-sm">Back to Home</Link>
    </div>
  );

  if (view === "posts") return <PostListScreen onBack={() => setView("dashboard")} onNew={() => { setEditingPost(undefined); setView("editor"); }} onEdit={(p) => { setEditingPost(p); setView("editor"); }} />;
  if (view === "editor") return <PostEditorScreen post={editingPost} onDone={() => setView("posts")} />;

  return <DashboardScreen onLogout={() => { localStorage.removeItem("ks-admin-pat"); setIsAuthenticated(false); }} setView={setView} />;
}
