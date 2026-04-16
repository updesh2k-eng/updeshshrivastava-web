"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Search, RefreshCw, Brain, FileText, Layers, Zap } from "lucide-react";
import { AdminHeader, Spinner } from "./ui";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stats {
  observations: number;
  summaries: number;
  prompts: number;
  projects: number;
}

interface Observation {
  id: string;
  tool: string;
  content: string;
  created_at: string;
  session_id?: string;
  project?: string;
}

interface Summary {
  id: string;
  content: string;
  created_at: string;
  session_id?: string;
}

interface SearchResult {
  id: string;
  type: "observation" | "summary";
  content: string;
  score?: number;
  created_at: string;
}

type Tab = "stats" | "observations" | "summaries" | "search";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function cm<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`/api/claude-mem/${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

function fmt(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function truncate(s: string, n = 220) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold mb-0.5">{value}</p>
      <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}

function ObservationRow({ obs }: { obs: Observation }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl p-4 cursor-pointer transition-colors hover:border-sky-500/40"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold shrink-0"
          style={{ background: "var(--border)", color: "var(--muted)" }}>
          {obs.tool ?? "tool"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug">{open ? obs.content : truncate(obs.content)}</p>
          <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>{fmt(obs.created_at)}</p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ s }: { s: Summary }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl p-4 cursor-pointer transition-colors hover:border-sky-500/40"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
      onClick={() => setOpen((o) => !o)}
    >
      <p className="text-sm leading-snug">{open ? s.content : truncate(s.content)}</p>
      <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>{fmt(s.created_at)}</p>
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export function MemoryScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workerUp, setWorkerUp] = useState<boolean | null>(null);

  // Check worker health
  useEffect(() => {
    cm<{ status: string }>("health")
      .then(() => setWorkerUp(true))
      .catch(() => setWorkerUp(false));
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cm<{
        total_observations?: number;
        total_summaries?: number;
        total_prompts?: number;
        total_projects?: number;
        observations?: number;
        summaries?: number;
        prompts?: number;
        projects?: number;
      }>("stats");
      setStats({
        observations: data.total_observations ?? data.observations ?? 0,
        summaries: data.total_summaries ?? data.summaries ?? 0,
        prompts: data.total_prompts ?? data.prompts ?? 0,
        projects: data.total_projects ?? data.projects ?? 0,
      });
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadObservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cm<Observation[] | { observations?: Observation[]; items?: Observation[] }>("observations");
      setObservations(Array.isArray(data) ? data : (data.observations ?? data.items ?? []));
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSummaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cm<Summary[] | { summaries?: Summary[]; items?: Summary[] }>("summaries");
      setSummaries(Array.isArray(data) ? data : (data.summaries ?? data.items ?? []));
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await cm<SearchResult[] | { results?: SearchResult[]; items?: SearchResult[] }>(
        `search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(Array.isArray(data) ? data : (data.results ?? data.items ?? []));
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (workerUp === false) return;
    if (tab === "stats") loadStats();
    else if (tab === "observations") loadObservations();
    else if (tab === "summaries") loadSummaries();
  }, [tab, workerUp, loadStats, loadObservations, loadSummaries]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "stats", label: "Stats" },
    { id: "observations", label: "Observations" },
    { id: "summaries", label: "Summaries" },
    { id: "search", label: "Search" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <AdminHeader
        title="Claude Memory"
        left={
          <button onClick={onBack} className="p-1.5 rounded-lg hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            <ArrowLeft size={15} />
          </button>
        }
        right={
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${workerUp === true ? "bg-green-500" : workerUp === false ? "bg-red-500" : "bg-yellow-500"}`} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {workerUp === true ? "Worker online" : workerUp === false ? "Worker offline" : "Checking…"}
            </span>
            {tab !== "search" && (
              <button
                onClick={() => {
                  if (tab === "stats") loadStats();
                  else if (tab === "observations") loadObservations();
                  else if (tab === "summaries") loadSummaries();
                }}
                className="p-1.5 rounded-lg hover:opacity-60 transition-opacity"
                style={{ color: "var(--muted)" }}
              >
                <RefreshCw size={13} />
              </button>
            )}
          </div>
        }
      />

      {/* Worker offline banner */}
      {workerUp === false && (
        <div className="mx-5 mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
          claude-mem worker is not running. Start it with:{" "}
          <code className="font-mono bg-red-500/10 px-1 rounded">npx claude-mem start</code>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id ? "bg-sky-500 text-white shadow-sm" : "hover:opacity-70"
              }`}
              style={tab !== t.id ? { color: "var(--muted)" } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          loading ? <Spinner /> : stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={<Brain size={16} className="text-indigo-400" />} label="Observations" value={stats.observations} color="bg-indigo-500/10" />
              <StatCard icon={<FileText size={16} className="text-sky-400" />} label="Summaries" value={stats.summaries} color="bg-sky-500/10" />
              <StatCard icon={<Zap size={16} className="text-violet-400" />} label="Prompts" value={stats.prompts} color="bg-violet-500/10" />
              <StatCard icon={<Layers size={16} className="text-emerald-400" />} label="Projects" value={stats.projects} color="bg-emerald-500/10" />
            </div>
          ) : null
        )}

        {/* Observations tab */}
        {tab === "observations" && (
          loading ? <Spinner /> : (
            <div className="flex flex-col gap-3">
              {observations.length === 0 && !loading && (
                <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No observations yet. Start a Claude Code session to capture memory.</p>
              )}
              {observations.map((obs) => <ObservationRow key={obs.id} obs={obs} />)}
            </div>
          )
        )}

        {/* Summaries tab */}
        {tab === "summaries" && (
          loading ? <Spinner /> : (
            <div className="flex flex-col gap-3">
              {summaries.length === 0 && !loading && (
                <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No summaries yet. Complete a Claude Code session to generate one.</p>
              )}
              {summaries.map((s) => <SummaryRow key={s.id} s={s} />)}
            </div>
          )
        )}

        {/* Search tab */}
        {tab === "search" && (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search past sessions, decisions, files…"
                  className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none focus:border-sky-500/60 transition-colors"
                  style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--foreground)" }}
                />
              </div>
              <button
                onClick={runSearch}
                disabled={loading || !query.trim()}
                className="px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-colors disabled:opacity-40"
              >
                {loading ? "…" : "Search"}
              </button>
            </div>
            {loading && <Spinner />}
            {!loading && searchResults.length === 0 && query && (
              <p className="text-sm text-center py-10" style={{ color: "var(--muted)" }}>No results for &quot;{query}&quot;</p>
            )}
            <div className="flex flex-col gap-3">
              {searchResults.map((r) => (
                <div key={r.id} className="border rounded-xl p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold"
                      style={{ background: "var(--border)", color: "var(--muted)" }}>
                      {r.type}
                    </span>
                    {r.score !== undefined && (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>score: {r.score.toFixed(3)}</span>
                    )}
                  </div>
                  <p className="text-sm leading-snug">{truncate(r.content)}</p>
                  <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>{fmt(r.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
