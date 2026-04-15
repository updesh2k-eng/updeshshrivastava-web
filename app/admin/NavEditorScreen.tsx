"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { AdminHeader, Spinner } from "./ui";
import { readConfig, writeConfig } from "./config-api";
import type { NavLink, SiteConfig } from "./types";

export function NavEditorScreen({ onDone }: { onDone: () => void }) {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [sha, setSha] = useState("");
  const [fullConfig, setFullConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { config, sha: s } = await readConfig();
        setFullConfig(config);
        setLinks(config.nav);
        setSha(s);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load config");
      } finally { setLoading(false); }
    })();
  }, []);

  function move(i: number, dir: -1 | 1) {
    setLinks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  async function handleSave() {
    if (!fullConfig) return;
    setSaving(true); setError("");
    try {
      await writeConfig({ ...fullConfig, nav: links }, sha);
      setSaved(true);
      setTimeout(onDone, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  const inputStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };

  if (loading) return <div className="min-h-screen" style={{ background: "var(--background)" }}><AdminHeader title="Navigation" /><Spinner /></div>;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Navigation"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <button onClick={handleSave} disabled={saving || saved} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 disabled:opacity-50">
            <Save size={13} />{saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        }
      />
      <div className="max-w-xl mx-auto px-5 py-10 flex flex-col gap-4">
        {error && <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">{error}</div>}
        <p className="text-xs" style={{ color: "var(--muted)" }}>Edit labels, toggle visibility, and reorder items. The URL paths cannot be changed here.</p>
        <div className="flex flex-col gap-2">
          {links.map((link, i) => (
            <div key={link.href} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-0.5 hover:opacity-60 disabled:opacity-20 transition-opacity" style={{ color: "var(--muted)" }}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === links.length - 1} className="p-0.5 hover:opacity-60 disabled:opacity-20 transition-opacity" style={{ color: "var(--muted)" }}>▼</button>
              </div>
              <input
                type="text"
                value={link.label}
                onChange={(e) => setLinks((prev) => prev.map((l, j) => j === i ? { ...l, label: e.target.value } : l))}
                className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:border-sky-500 transition-colors"
                style={inputStyle}
              />
              <code className="text-xs px-2" style={{ color: "var(--muted)" }}>{link.href}</code>
              <button
                onClick={() => setLinks((prev) => prev.map((l, j) => j === i ? { ...l, visible: !l.visible } : l))}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${link.visible ? "border-sky-500/50 text-sky-400" : ""}`}
                style={link.visible ? {} : { borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {link.visible ? "Visible" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
