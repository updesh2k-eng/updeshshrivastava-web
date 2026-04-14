"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
  content: any;
  onChange: (val: any) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ 
        placeholder: 'Write your content here (supports Markdown shortcuts)...' 
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // We save as HTML to keep it compatible with your existing MDXRemote renderer
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none min-h-[400px] focus:outline-none p-4',
      },
    },
  });

  if (!editor) return null;

  const MenuButton = ({ onClick, active, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
        active ? 'bg-sky-500 text-white' : 'hover:bg-black/10 dark:hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-black/5 dark:bg-white/5">
        <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>B</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>I</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>H2</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>H3</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>List</MenuButton>
        <MenuButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')}>Code</MenuButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
