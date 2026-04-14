"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import LinkExt from "@tiptap/extension-link";
import YoutubeExt from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Image, Video, Code2, Unlink,
} from "lucide-react";

const lowlight = createLowlight(common);

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      ImageExt.configure({ inline: false, allowBase64: false }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      YoutubeExt.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder: "Start writing your post…" }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor prose max-w-none min-h-[420px] px-5 py-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `posts/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("post-media")
        .upload(path, file, { upsert: true });
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      const { data } = supabase.storage.from("post-media").getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    },
    [editor]
  );

  const handleImageFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadImage(file);
      e.target.value = "";
    },
    [uploadImage]
  );

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = prompt("URL:", prev ?? "https://");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = prompt("YouTube URL:");
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const active = (name: string, attrs?: object) =>
    editor.isActive(name, attrs)
      ? "gradient-bg text-white"
      : "hover:opacity-70";
  const btn = (name: string, attrs?: object) =>
    `p-1.5 rounded text-xs transition-all ${active(name, attrs)}`;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={btn("bold")}><Bold size={13} /></button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn("italic")}><Italic size={13} /></button>
        <button type="button" title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn("strike")}><Strikethrough size={13} /></button>
        <button type="button" title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} className={btn("code")}><Code size={13} /></button>

        <span className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />

        <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn("heading", { level: 1 })}><Heading1 size={13} /></button>
        <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn("heading", { level: 2 })}><Heading2 size={13} /></button>
        <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn("heading", { level: 3 })}><Heading3 size={13} /></button>

        <span className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />

        <button type="button" title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn("bulletList")}><List size={13} /></button>
        <button type="button" title="Ordered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn("orderedList")}><ListOrdered size={13} /></button>
        <button type="button" title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn("blockquote")}><Quote size={13} /></button>
        <button type="button" title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn("codeBlock")}><Code2 size={13} /></button>

        <span className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />

        <button type="button" title="Add link" onClick={addLink} className={btn("link")}><Link2 size={13} /></button>
        <button
          type="button"
          title="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          className="p-1.5 rounded text-xs transition-all hover:opacity-70 disabled:opacity-20"
        ><Unlink size={13} /></button>

        <span className="w-px h-5 mx-1 self-center" style={{ background: "var(--border)" }} />

        <button type="button" title="Upload image" onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded text-xs transition-all hover:opacity-70"><Image size={13} /></button>
        <button type="button" title="Embed YouTube" onClick={addYoutube} className="p-1.5 rounded text-xs transition-all hover:opacity-70"><Video size={13} /></button>
        <button type="button" title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-1.5 rounded text-xs transition-all hover:opacity-70"><Minus size={13} /></button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleImageFile}
      />

      <EditorContent editor={editor} />
    </div>
  );
}
