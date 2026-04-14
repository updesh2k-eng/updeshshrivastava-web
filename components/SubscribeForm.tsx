"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/supabase-posts";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await subscribeToNewsletter(email);
      setStatus("sent");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not subscribe. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        ✓ You&apos;re subscribed. Thanks!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>
        Stay updated
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:border-sky-500 transition-colors min-w-0"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "sending" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}
