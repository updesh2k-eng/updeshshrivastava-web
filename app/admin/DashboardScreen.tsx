"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { AdminHeader } from "./ui";

export function DashboardScreen({
  onLogout,
  onNav,
}: {
  onLogout: () => void;
  onNav: (dest: string) => void;
}) {
  const cards = [
    { id: "posts",    label: "Blog Posts",       desc: "Create, edit, delete posts",           icon: "✍️" },
    { id: "comments", label: "Comments",         desc: "Approve, reject, delete comments",     icon: "💬" },
    { id: "linkedin", label: "LinkedIn Posts",   desc: "Add & manage LinkedIn post embeds",    icon: "🔗" },
    { id: "nav",      label: "Navigation",       desc: "Rename & reorder menu links",          icon: "📋" },
    { id: "home",     label: "Home Page",        desc: "Hero text, proof points, social",      icon: "🏠" },
    { id: "images",   label: "Images",           desc: "Upload & replace site images",         icon: "🖼️" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Site Admin"
        left={
          <Link href="/" className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="View site">
            <ArrowLeft size={15} />
          </Link>
        }
        right={
          <button onClick={onLogout} className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }} title="Sign out">
            <LogOut size={13} />
          </button>
        }
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
