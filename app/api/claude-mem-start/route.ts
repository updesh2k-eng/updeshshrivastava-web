// Starts the claude-mem worker in the background.
// Only works in local dev — on production the worker cannot run.
import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST() {
  try {
    // Spawn detached so it keeps running after this request completes
    const child = spawn("npx", ["claude-mem", "start"], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env, PATH: process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin" },
    });
    child.unref();

    // Give it up to 8 seconds to become healthy
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch("http://localhost:37777/health");
        if (res.ok) return NextResponse.json({ ok: true });
      } catch {
        // not ready yet
      }
    }

    return NextResponse.json({ ok: false, error: "Worker started but did not respond in time. Try refreshing." }, { status: 503 });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
