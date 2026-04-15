// Requires GITHUB_PAT env var — set it in .env.local and Vercel project settings.
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const REPO = "updesh2k-eng/updeshshrivastava-web";
const GH_API = "https://api.github.com";

function ghHeaders(): HeadersInit {
  const pat = process.env.GITHUB_PAT;
  if (!pat) throw new Error("GITHUB_PAT env var is not set. Add it to .env.local and Vercel project settings.");
  return {
    Authorization: `token ${pat}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return false;
  const { data: { user } } = await supabase.auth.getUser(token);
  return !!user;
}

export async function GET() {
  try {
    const res = await fetch(`${GH_API}/repos/${REPO}/contents/public`, {
      headers: ghHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ error: `GitHub ${res.status}` }, { status: res.status });
    const data = await res.json();
    const images = (Array.isArray(data) ? data : []).filter((f: { name: string }) =>
      /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(f.name)
    );
    return NextResponse.json(images);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { path, content, sha } = await req.json() as { path: string; content: string; sha?: string };
    const res = await fetch(`${GH_API}/repos/${REPO}/contents/public/${path}`, {
      method: "PUT",
      headers: { ...ghHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message: `chore: update image ${path}`, content, ...(sha ? { sha } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { message?: string }).message ?? `GitHub ${res.status}` }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
