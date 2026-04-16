// Proxy for the claude-mem worker running on localhost:37777.
// Only works in local dev — on production the worker is not present.
import { NextRequest, NextResponse } from "next/server";

const WORKER = "http://localhost:37777";

type Params = { path: string[] };

async function proxy(req: NextRequest, params: Params, method: string) {
  const subpath = params.path.join("/");
  const search = req.nextUrl.search ?? "";
  const url = `${WORKER}/api/${subpath}${search}`;

  try {
    const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (method === "POST") {
      const body = await req.text();
      if (body) (init as { body?: string }).body = body;
    }
    const res = await fetch(url, init);
    const data = await res.json().catch(() => null);
    return NextResponse.json(data ?? {}, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: "claude-mem worker is not running. Start it with: npx claude-mem start" },
      { status: 503 }
    );
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, "GET");
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  return proxy(req, await params, "POST");
}
