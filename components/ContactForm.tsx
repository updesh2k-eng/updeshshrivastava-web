"use client";

import { useState } from "react";
import { submitContact } from "@/lib/supabase-posts";
import { Send } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitContact(form.name, form.email, form.message);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const iCls =
    "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const iStyle = {
    background: "var(--card)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };
  const lCls = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const lStyle = { color: "var(--muted)" };

  if (status === "sent") {
    return (
      <div
        className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl border text-center"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white text-xl">
          ✓
        </div>
        <p className="font-semibold">Message sent!</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          I'll get back to you as soon as I can.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs underline hover:opacity-70 transition-opacity mt-2"
          style={{ color: "var(--muted)" }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={lCls} style={lStyle}>Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            className={iCls}
            style={iStyle}
          />
        </div>
        <div>
          <label className={lCls} style={lStyle}>Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className={iCls}
            style={iStyle}
          />
        </div>
      </div>

      <div>
        <label className={lCls} style={lStyle}>Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="What's on your mind?"
          className={iCls}
          style={{ ...iStyle, resize: "vertical" }}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Send size={14} />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
