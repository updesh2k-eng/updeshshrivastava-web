"use client";

import { useState } from "react";
import Link from "next/link";
import { GH_API, REPO, PAT_KEY } from "./constants";

export function LoginScreen({ onLogin }: { onLogin: (pat: string) => void }) {
  const [pat, setPat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userRes = await fetch(`${GH_API}/user`, {
        headers: { Authorization: `token ${pat}`, Accept: "application/vnd.github+json" },
      });
      if (!userRes.ok) throw new Error("Invalid token — it may be expired or malformed.");

      const repoRes = await fetch(`${GH_API}/repos/${REPO}`, {
        headers: { Authorization: `token ${pat}`, Accept: "application/vnd.github+json" },
      });
      if (!repoRes.ok) throw new Error("Token cannot access the repository. Check you selected the right repo when creating the token.");
      const repoData = await repoRes.json() as { permissions?: { push?: boolean } };
      if (repoData.permissions && repoData.permissions.push === false) {
        throw new Error("Token has read-only access. You need write (push) permission on the repository.");
      }

      localStorage.setItem(PAT_KEY, pat);
      onLogin(pat);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
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
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <div className="mt-2 text-xs rounded-xl border p-3 flex flex-col gap-2" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>Recommended: Classic token (simpler)</p>
              <p>
                <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
                  github.com/settings/tokens/new
                </a>
                {" "}→ tick the <strong>repo</strong> checkbox → Generate.
              </p>
              <p className="pt-1 border-t" style={{ borderColor: "var(--border)" }}>
                <span className="font-semibold" style={{ color: "var(--foreground)" }}>Or: Fine-grained token</span>
                {" "}→ Repository: <strong>updeshshrivastava-web</strong> → Permissions → Contents: <strong>Read &amp; Write</strong>.
              </p>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !pat}
            className="py-3 rounded-xl font-medium text-sm gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
          <Link href="/" className="underline hover:opacity-70">Back to site</Link>
        </p>
      </div>
    </div>
  );
}
