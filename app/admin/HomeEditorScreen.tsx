"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { AdminHeader, Spinner } from "./ui";
import { readConfig, writeConfig } from "./config-api";
import type { SiteConfig } from "./types";

export function HomeEditorScreen({ pat, onDone }: { pat: string; onDone: () => void }) {
  type HomeConfig = SiteConfig["home"];
  type BrandConfig = SiteConfig["brand"];
  const [home, setHome] = useState<HomeConfig | null>(null);
  const [brand, setBrand] = useState<BrandConfig | null>(null);
  const [sha, setSha] = useState("");
  const [fullConfig, setFullConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"brand" | "hero" | "work" | "cta">("brand");

  useEffect(() => {
    (async () => {
      try {
        const { config, sha: s } = await readConfig(pat);
        setFullConfig(config); setHome(config.home); setBrand(config.brand); setSha(s);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load config");
      } finally { setLoading(false); }
    })();
  }, [pat]);

  async function handleSave() {
    if (!fullConfig || !home || !brand) return;
    setSaving(true); setError("");
    try {
      await writeConfig(pat, { ...fullConfig, brand, home }, sha);
      setSaved(true); setTimeout(onDone, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  }

  const iStyle = { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" };
  const iCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:border-sky-500 transition-colors";
  const lCls = "block text-xs font-semibold uppercase tracking-wider mb-1.5";
  const lStyle = { color: "var(--muted)" };

  if (loading) return <div className="min-h-screen" style={{ background: "var(--background)" }}><AdminHeader title="Home Page" /><Spinner /></div>;
  if (!home || !brand) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Home Page"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <button onClick={handleSave} disabled={saving || saved} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 disabled:opacity-50">
            <Save size={13} />{saved ? "Saved!" : saving ? "Saving…" : "Save"}
          </button>
        }
      />

      {/* Tabs */}
      <div className="border-b px-5 flex gap-1" style={{ borderColor: "var(--border)" }}>
        {(["brand", "hero", "work", "cta"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-semibold capitalize transition-colors ${tab === t ? "border-b-2 border-sky-500 text-sky-400" : "hover:opacity-70"}`}
            style={tab !== t ? { color: "var(--muted)" } : {}}
          >{t === "work" ? "Featured Work" : t === "cta" ? "CTA Section" : t === "brand" ? "Brand" : "Hero"}</button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-5 py-8 flex flex-col gap-5">
        {error && <div className="text-sm text-red-400 p-4 rounded-xl border border-red-500/30 bg-red-500/10">{error}</div>}

        {tab === "brand" && (
          <>
            <div><label className={lCls} style={lStyle}>Site name</label>
              <input className={iCls} style={iStyle} value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Tagline</label>
              <input className={iCls} style={iStyle} value={brand.tagline} onChange={(e) => setBrand({ ...brand, tagline: e.target.value })} /></div>
          </>
        )}

        {tab === "hero" && (
          <>
            <div><label className={lCls} style={lStyle}>Badge text</label>
              <input className={iCls} style={iStyle} value={home.badge} onChange={(e) => setHome({ ...home, badge: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Headline</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={home.headline} onChange={(e) => setHome({ ...home, headline: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Subheadline</label>
              <input className={iCls} style={iStyle} value={home.subheadline} onChange={(e) => setHome({ ...home, subheadline: e.target.value })} /></div>
            <div><label className={lCls} style={lStyle}>Proof Points <span className="normal-case font-normal">(one per line)</span></label>
              <textarea className={`${iCls} font-mono text-xs`} style={{ ...iStyle, resize: "vertical" }} rows={4}
                value={home.proofPoints.join("\n")}
                onChange={(e) => setHome({ ...home, proofPoints: e.target.value.split("\n").filter(Boolean) })} /></div>
            <div className="grid sm:grid-cols-3 gap-3">
              {(["github", "twitter", "linkedin"] as const).map((k) => (
                <div key={k}><label className={lCls} style={lStyle}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                  <input className={iCls} style={iStyle} value={home.social[k]}
                    onChange={(e) => setHome({ ...home, social: { ...home.social, [k]: e.target.value } })} /></div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={lCls} style={lStyle}>Primary CTA label</label>
                <input className={iCls} style={iStyle} value={home.ctaPrimary.label}
                  onChange={(e) => setHome({ ...home, ctaPrimary: { ...home.ctaPrimary, label: e.target.value } })} /></div>
              <div><label className={lCls} style={lStyle}>Secondary CTA label</label>
                <input className={iCls} style={iStyle} value={home.ctaSecondary.label}
                  onChange={(e) => setHome({ ...home, ctaSecondary: { ...home.ctaSecondary, label: e.target.value } })} /></div>
            </div>
          </>
        )}

        {tab === "work" && home.featuredWork.map((proj, i) => (
          <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Project {i + 1}</p>
            <div><label className={lCls} style={lStyle}>Title</label>
              <input className={iCls} style={iStyle} value={proj.title}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], title: e.target.value }; setHome({ ...home, featuredWork: fw }); }} /></div>
            <div><label className={lCls} style={lStyle}>Description</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={proj.description}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], description: e.target.value }; setHome({ ...home, featuredWork: fw }); }} /></div>
            <div><label className={lCls} style={lStyle}>Tags <span className="normal-case font-normal">(comma-separated)</span></label>
              <input className={iCls} style={iStyle} value={proj.tags.join(", ")}
                onChange={(e) => { const fw = [...home.featuredWork]; fw[i] = { ...fw[i], tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) }; setHome({ ...home, featuredWork: fw }); }} /></div>
          </div>
        ))}

        {tab === "cta" && (
          <>
            <div><label className={lCls} style={lStyle}>Title</label>
              <input className={iCls} style={iStyle} value={home.ctaSection.title} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, title: e.target.value } })} /></div>
            <div><label className={lCls} style={lStyle}>Description</label>
              <textarea className={iCls} style={{ ...iStyle, resize: "vertical" }} rows={2} value={home.ctaSection.description} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, description: e.target.value } })} /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={lCls} style={lStyle}>Button label</label>
                <input className={iCls} style={iStyle} value={home.ctaSection.buttonLabel} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, buttonLabel: e.target.value } })} /></div>
              <div><label className={lCls} style={lStyle}>Button link</label>
                <input className={iCls} style={iStyle} value={home.ctaSection.buttonHref} onChange={(e) => setHome({ ...home, ctaSection: { ...home.ctaSection, buttonHref: e.target.value } })} /></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
