// Starts the claude-mem worker in the background.
// Only works in local dev — on production the worker cannot run.
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import os from "os";

function findPluginRoot(): string | null {
  const base = join(os.homedir(), ".claude/plugins/cache/thedotmack/claude-mem");
  if (!existsSync(base)) return null;
  // Pick highest semver directory
  const versions = readdirSync(base).sort().reverse();
  for (const v of versions) {
    const p = join(base, v);
    if (existsSync(join(p, "scripts/bun-runner.js"))) return p;
  }
  return null;
}

export async function POST() {
  try {
    // Already running?
    try {
      const already = await fetch("http://localhost:37777/health", { signal: AbortSignal.timeout(1000) });
      if (already.ok) return NextResponse.json({ ok: true });
    } catch { /* not running */ }

    const pluginRoot = findPluginRoot();
    if (!pluginRoot) {
      return NextResponse.json({ ok: false, error: "claude-mem plugin not found. Run: npx claude-mem install" }, { status: 500 });
    }

    const bunRunner  = join(pluginRoot, "scripts/bun-runner.js");
    const workerCjs  = join(pluginRoot, "scripts/worker-service.cjs");
    const bunBin     = join(os.homedir(), ".bun/bin/bun");

    // Use the exact same invocation as the SessionStart hook
    const child = spawn(
      process.execPath,            // node
      [bunRunner, workerCjs, "start"],
      {
        detached: true,
        stdio: "ignore",
        env: {
          ...process.env,
          CLAUDE_PLUGIN_ROOT: pluginRoot,
          BUN_BINARY: existsSync(bunBin) ? bunBin : "bun",
          PATH: [
            join(os.homedir(), ".bun/bin"),
            join(os.homedir(), ".local/bin"),
            "/usr/local/bin",
            "/opt/homebrew/bin",
            "/usr/bin",
            "/bin",
            process.env.PATH ?? "",
          ].join(":"),
        },
      }
    );
    child.unref();

    // Poll up to 30s
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch("http://localhost:37777/health", { signal: AbortSignal.timeout(1000) });
        if (res.ok) return NextResponse.json({ ok: true });
      } catch { /* not ready yet */ }
    }

    return NextResponse.json(
      { ok: false, error: "Worker is taking longer than expected. Please wait a moment then click Start Worker again." },
      { status: 503 }
    );
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
