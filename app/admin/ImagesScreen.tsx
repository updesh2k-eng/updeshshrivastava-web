"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { AdminHeader, Spinner } from "./ui";
import { listImages, uploadImage } from "./images-api";
import { REPO } from "./constants";
import type { GHFile } from "./types";

export function ImagesScreen({ pat, onDone }: { pat: string; onDone: () => void }) {
  const [images, setImages] = useState<GHFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try { setImages(await listImages(pat)); }
      catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to load images"); }
      finally { setLoading(false); }
    })();
  }, [pat]);

  async function handleUpload(file: File, existing?: GHFile) {
    const name = existing ? existing.name : file.name;
    setUploading(name); setError(""); setSuccess("");
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await uploadImage(pat, name, base64, existing?.sha);
      setSuccess(`${name} uploaded — site will update after Vercel rebuilds.`);
      setImages(await listImages(pat));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally { setUploading(null); }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Images"
        left={<button onClick={onDone} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}><ArrowLeft size={15} /></button>}
        right={
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold gradient-bg text-white hover:opacity-90 cursor-pointer">
            <Plus size={13} /> Upload new
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
          </label>
        }
      />
      <div className="max-w-2xl mx-auto px-5 py-10">
        {error && <div className="text-sm text-red-400 p-3 rounded-xl border border-red-500/30 bg-red-500/10 mb-4">{error}</div>}
        {success && <div className="text-sm text-green-400 p-3 rounded-xl border border-green-500/30 bg-green-500/10 mb-4">{success}</div>}
        {loading ? <Spinner /> : (
          <div className="grid sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div key={img.sha} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <div className="h-32 flex items-center justify-center p-4 bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://raw.githubusercontent.com/${REPO}/main/public/${img.name}?t=${Date.now()}`}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{img.name}</span>
                  <label className={`text-xs px-2.5 py-1 rounded-lg border cursor-pointer hover:opacity-70 transition-opacity ${uploading === img.name ? "opacity-40 pointer-events-none" : ""}`}
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                    {uploading === img.name ? "Uploading…" : "Replace"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, img); e.target.value = ""; }} />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-6 text-xs text-center" style={{ color: "var(--muted)" }}>
          Images are served from <code>public/</code>. Uploading commits to GitHub and Vercel rebuilds automatically.
        </p>
      </div>
    </div>
  );
}
