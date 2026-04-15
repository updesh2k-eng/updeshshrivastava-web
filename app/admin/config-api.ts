import type { SiteConfig } from "./types";
import { supabase } from "@/lib/supabase";

async function authHeader(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function readConfig(): Promise<{ config: SiteConfig; sha: string }> {
  const res = await fetch("/api/github/config", { cache: "no-store" });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${res.statusText}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  const raw = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ""))));
  return { config: JSON.parse(raw) as SiteConfig, sha: data.sha };
}

export async function writeConfig(config: SiteConfig, sha: string) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(config, null, 2))));
  const res = await fetch("/api/github/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ message: "chore: update site config", content, sha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `GitHub ${res.status}`);
  }
}
