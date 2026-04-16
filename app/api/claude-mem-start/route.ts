// Starts the claude-mem worker in the background.
// Only works in local dev — on production the worker cannot run.
import { NextResponse } from "next/server";
import { spawn, execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import os from "os";

function shellExists(p: string): boolean {
  try { execSync(`test -e ${JSON.stringify(p)}`); return true; } catch { return false; }
}

function shellList(dir: string): string[] {
  try { return execSync(`ls ${JSON.stringify(dir)} 2>/dev/null`, { encoding: "utf-8" }).trim().split("\n").filter(Boolean); } catch { return []; }
}

function findPluginRoot(): { root: string | null; diag: string } {
  const homes = [os.homedir(), process.env.HOME ?? "", "/root", "/home/user"].filter((h, i, a) => h && a.indexOf(h) === i);
  const tried: string[] = [];

  for (const home of homes) {
    const base = `${home}/.claude/plugins/cache/thedotmack/claude-mem`;
    tried.push(base);
    const versions = shellList(base).sort().reverse();
    for (const v of versions) {
      const p = `${base}/${v}`;
      if (shellExists(`${p}/scripts/bun-runner.js`)) return { root: p, diag: `found at ${p}` };
    }
  }
  return { root: null, diag: `homes tried: ${homes.join(", ")}; bases: ${tried.join(", ")}` };
}

export async function POST() {
  try {
    // Already running?
    try {
      const already = await fetch("http://localhost:37777/health", { signal: AbortSignal.timeout(1000) });
      if (already.ok) return NextResponse.json({ ok: true });
    } catch { /* not running */ }

    const { root: pluginRoot, diag } = findPluginRoot();
    if (!pluginRoot) {
      return NextResponse.json(
        { ok: false, error: `claude-mem plugin not found (${diag}). Run: npx claude-mem install` },
        { status: 500 }
      );
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
