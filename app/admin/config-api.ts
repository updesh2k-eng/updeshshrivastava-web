import { REPO, CONFIG_PATH } from "./constants";
import type { GHContent, SiteConfig } from "./types";
import { ghFetch, ghWriteError } from "./github";

export async function readConfig(pat: string): Promise<{ config: SiteConfig; sha: string }> {
  const res = await ghFetch(`/repos/${REPO}/contents/${CONFIG_PATH}`, pat);
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data: GHContent = await res.json();
  const raw = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
  return { config: JSON.parse(raw) as SiteConfig, sha: data.sha };
}

export async function writeConfig(pat: string, config: SiteConfig, sha: string) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(config, null, 2))));
  const res = await ghFetch(`/repos/${REPO}/contents/${CONFIG_PATH}`, pat, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "chore: update site config", content, sha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw ghWriteError((err as { message?: string }).message || `GitHub ${res.status}`);
  }
}
