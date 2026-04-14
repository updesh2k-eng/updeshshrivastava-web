"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, LogOut, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

// -- Types --

interface Post {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: any; // Now explicitly JSON
  status: "draft" | "published";
}

// -- Editor Component --

function TiptapEditor({ content, onChange }: { content: any, onChange: (val: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[500px] focus:outline-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  }, [content]);

  if (!editor) return null;

  const btnClass = (active: boolean) => 
    `px-2 py-1 rounded text-xs font-medium transition-colors ${active ? 'bg-sky-500 text-white' : 'hover:bg-[var(--border)] text-[var(--muted)]'}`;

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-black/5 sticky top-0 z-10 backdrop-blur-md">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>H3</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>List</button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>Quote</button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))}>Code</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

// -- UI Components --

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 rounded-full animate-spin border-sky-500 border-t-transparent" />
    </div>
  );
}

function AdminHeader({ title, left, right }: { title: string; left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b px-5 h-14 flex items-center justify-between bg-[var(--background)] border-[var(--border)]">
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
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader 
        title="Admin Dashboard" 
        left={<Link href="/" className="p-1.5 rounded-lg hover:opacity-60"><ArrowLeft size={15} /></Link>}
        right={<button onClick={onLogout} className="p-1.5 rounded-lg hover:opacity-60"><LogOut size={13} /></button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <button onClick={() => setView("posts")} className="text-left p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-sky-500/50 transition-all group">
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">✍️</div>
            <p className="font-semibold text-sm mb-1">Blog Posts</p>
            <p className="text-xs text-[var(--muted)]">Manage your articles and essays</p>
          </button>
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
    if (!confirm("Delete post? This is permanent.")) return;
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminHeader 
        title="All Posts" 
        left={<button onClick={onBack} className="p-1.5"><ArrowLeft size={15} /></button>}
        right={<button onClick={onNew} className="px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"><Plus size={13} className="inline mr-1" /> New Post</button>}
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        {loading ? <Spinner /> : (
          <div className="flex flex-col border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
            {posts.length === 0 ? (
              <p className="p-10 text-center text-sm text-[var(--muted)]">No posts found in database.</p>
            ) : posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-black/5 transition-colors">
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-[var(--muted)]">{post.date} • <span className={post.status === 'published' ? 'text-green-500' : 'text-amber-500'}>{post.status}</span></p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(post)} className="p-2 hover:bg-[var(--border)] rounded-lg transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => deletePost(post.id!)} className="p-2 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
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
    excerpt: "",
    status: "draft",
    tags: [],
    content: null 
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.title || !form.slug) {
      alert("Title and Slug are required.");
      return;
    }
    setSaving(true);
    const postData = { ...form };
    
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
        title={post ? "Editing Post" : "Drafting New Post"} 
        left={<button onClick={onDone} className="p-1.5"><ArrowLeft size={15} /></button>}
        right={
          <div className="flex items-center gap-3">
            <select 
              className="bg-transparent text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer"
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value as any})}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 rounded-lg text-xs font-bold gradient-bg text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      />
      <div className="max-w-3xl mx-auto px-5 py-10 flex flex-col gap-6">
        <input 
          className="text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none placeholder:opacity-20 w-full" 
          placeholder="Untitled Post" 
          value={form.title} 
          onChange={e => {
            const t = e.target.value;
            setForm({...form, title: t, slug: post ? form.slug : t.toLowerCase().replace(/[^a-z0-9]+/g, '-')});
          }} 
        />
        
        <div className="flex flex-col gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]/50">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Slug</label>
              <input className="bg-transparent text-xs outline-none border-b border-transparent focus:border-sky-500 pb-1" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Date</label>
              <input type="date" className="bg-transparent text-xs outline-none border-b border-transparent focus:border-sky-500 pb-1" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Excerpt</label>
            <textarea 
              className="bg-transparent text-xs outline-none border-b border-transparent focus:border-sky-500 pb-1 resize-none" 
              rows={2} 
              placeholder="Brief summary for the preview card..."
              value={form.excerpt} 
              onChange={e => setForm({...form, excerpt: e.target.value})} 
            />
          </div>
        </div>

        <TiptapEditor content={form.content} onChange={(json) => setForm({...form, content: json})} />
      </div>
    </div>
  );
}

// -- Root Admin Page --

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
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div className="max-w-xs">
        <h1 className="text-xl font-bold mb-2">Restricted Access</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Please log in through the original authentication flow to manage the database.</p>
        <Link href="/" className="inline-block px-6 py-2 rounded-xl border border-[var(--border)] text-sm hover:bg-[var(--card)] transition-colors">Return Home</Link>
      </div>
    </div>
  );

  if (view === "posts") return <PostListScreen onBack={() => setView("dashboard")} onNew={() => { setEditingPost(undefined); setView("editor"); }} onEdit={(p) => { setEditingPost(p); setView("editor"); }} />;
  if (view === "editor") return <PostEditorScreen post={editingPost} onDone={() => setView("posts")} />;

  return <DashboardScreen onLogout={() => { localStorage.removeItem("ks-admin-pat"); setIsAuthenticated(false); }} setView={setView} />;
}
