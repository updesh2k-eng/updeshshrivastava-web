"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  postSlug: string;
  labels?: {
    title: string;
    name: string;
    email: string;
    comment: string;
    submit: string;
    successTitle: string;
    successBody: string;
    error: string;
  };
}

const defaultLabels = {
  title: "Leave a comment",
  name: "Name",
  email: "Email",
  comment: "Comment",
  submit: "Submit",
  successTitle: "Comment submitted",
  successBody: "Your comment is awaiting moderation. It will appear once approved.",
  error: "Failed to submit. Please try again.",
};

export function CommentForm({ postSlug, labels }: Props) {
  const l = { ...defaultLabels, ...labels };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_slug: postSlug, author_name: name, author_email: email, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? l.error);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg(l.error);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="text-2xl mb-3">✓</div>
        <p className="font-semibold text-sm mb-1">{l.successTitle}</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{l.successBody}</p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--background)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  return (
    <div className="rounded-2xl border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <h3 className="font-bold text-base mb-5">{l.title}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {l.name} <span style={{ color: "var(--accent-1)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors"
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {l.email} <span style={{ color: "var(--accent-1)" }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={200}
              className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            {l.comment} <span style={{ color: "var(--accent-1)" }}>*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            className="px-3 py-2 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors resize-none"
            style={inputStyle}
          />
          <p className="text-xs text-right" style={{ color: "var(--muted)" }}>
            {content.length}/2000
          </p>
        </div>

        {status === "error" && (
          <p className="text-sm px-3 py-2 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            {errorMsg}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={13} />
            {status === "submitting" ? "..." : l.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
