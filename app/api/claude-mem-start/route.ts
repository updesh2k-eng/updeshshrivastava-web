// Starts the claude-mem worker in the background.
// Only works in local dev — on production the worker cannot run.
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { execSync } from "child_process";

function resolvePath(): string {
  // Pick up nvm / homebrew / local bin paths the same way claude-mem hooks do
  try {
    return execSync("$SHELL -lc 'echo $PATH' 2>/dev/null", { encoding: "utf8" }).trim()
      + ":" + (process.env.PATH ?? "/usr/local/bin:/usr/bin:/bin");
  } catch {
    return [
      process.env.PATH,
      `${process.env.HOME}/.nvm/versions/node/current/bin`,
      `${process.env.HOME}/.local/bin`,
      "/usr/local/bin",
      "/opt/homebrew/bin",
      "/usr/bin",
      "/bin",
    ].filter(Boolean).join(":");
  }
}

export async function POST() {
  try {
    // Check if already running first
    try {
      const already = await fetch("http://localhost:37777/health");
      if (already.ok) return NextResponse.json({ ok: true });
    } catch { /* not running */ }

    const child = spawn("npx", ["claude-mem", "start"], {
      detached: true,
      stdio: "ignore",
      env: { ...process.env, PATH: resolvePath() },
    });
    child.unref();

    // Poll up to 20s — same patience as claude-mem's own SessionStart hook
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch("http://localhost:37777/health");
        if (res.ok) return NextResponse.json({ ok: true });
      } catch { /* not ready yet */ }
    }

    return NextResponse.json(
      { ok: false, error: "Worker is starting — it may need a few more seconds. Please refresh the page." },
      { status: 503 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
