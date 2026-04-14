import { REPO } from "./constants";
import type { GHFile } from "./types";
import { ghFetch, ghWriteError } from "./github";

export async function listImages(pat: string): Promise<GHFile[]> {
  const res = await ghFetch(`/repos/${REPO}/contents/public`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).filter((f: GHFile) =>
    /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(f.name)
  );
}

export async function uploadImage(pat: string, path: string, base64: string, sha?: string) {
  const res = await ghFetch(`/repos/${REPO}/contents/public/${path}`, pat, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore: update image ${path}`,
      content: base64,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}`);
  }
}
