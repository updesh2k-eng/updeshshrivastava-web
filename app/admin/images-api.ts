import type { GHFile } from "./types";
import { supabase } from "@/lib/supabase";

async function authHeader(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export async function listImages(): Promise<GHFile[]> {
  const res = await fetch("/api/github/images", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load images: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data as GHFile[];
}

export async function uploadImage(path: string, base64: string, sha?: string) {
  const res = await fetch("/api/github/images", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ path, content: base64, sha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Upload failed: ${res.status}`);
  }
}
