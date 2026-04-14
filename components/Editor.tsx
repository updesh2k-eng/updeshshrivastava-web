"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

export default function Editor({ content, onChange }: { content: any, onChange: (val: any) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON()); // We save as JSON for maximum flexibility
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
      {/* Basic Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-black/5">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-sky-500 text-white' : 'hover:bg-black/10'}`}
        >
          B
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-sky-500 text-white' : 'hover:bg-black/10'}`}
        >
          I
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${editor.isActive('heading') ? 'bg-sky-500 text-white' : 'hover:bg-black/10'}`}
        >
          H2
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-sky-500 text-white' : 'hover:bg-black/10'}`}
        >
          List
        </button>
      </div>

      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-4 min-h-[400px] outline-none"
      />
    </div>
  );
}
