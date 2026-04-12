import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real systems solving real problems. AI agent infrastructure, PropTech automation, and investment systems — documented honestly.",
};

type StatusVariant = "amber" | "blue" | "green";

const statusStyles: Record<StatusVariant, React.CSSProperties> = {
  amber: {
    background: "rgba(245,158,11,0.1)",
    color: "#d97706",
    border: "1px solid rgba(245,158,11,0.25)",
  },
  blue: {
    background: "rgba(14,165,233,0.1)",
    color: "#0ea5e9",
    border: "1px solid rgba(14,165,233,0.25)",
  },
  green: {
    background: "rgba(34,197,94,0.1)",
    color: "#16a34a",
    border: "1px solid rgba(34,197,94,0.25)",
  },
};

interface CaseStudy {
  title: string;
  status: string;
  statusVariant: StatusVariant;
  category: string;
  problem: string;
  approach: string | React.ReactNode;
  result: string;
  stack: string[];
}

const caseStudies: CaseStudy[] = [
  {
    title: "AI Command Center",
    status: "In Development",
    statusVariant: "amber",
    category: "Personal Automation · AI Infrastructure",
    problem:
      "Property income and expenses across multiple units. WEG statements. Bills, receipts, and documents across dozens of categories. Eight years of self-filing complete German tax returns. All of it important. All of it repetitive. All of it eating my weekends.",
    approach: `Hybrid architecture — local Ollama models running on-device for privacy-sensitive document processing, Claude API reserved for tasks requiring genuine reasoning. Seven specialist agents governed by a machine-readable Constitution that enforces a hard monthly budget cap and privacy rules.

Seven agents:
· Supervisor Orchestrator — routes tasks, enforces Constitution, tracks spend
· Tax Consultant — German tax law, Finanzamt documents, Elster filing
· Financial Planner — portfolio tracking, ETF rebalancing, P&L reports
· File Manager (The Librarian) — document classification, Google Drive organisation
· Health Agent — reimbursement claims, health document management
· Innovation Agent — AI news digest, research, idea capture
· Business Operations Agent — invoice management, scheduling, client documents

Routing logic: Sensitive documents processed locally via Apple Vision OCR — raw files never leave the device. Only anonymised values reach the cloud API. Cost governance enforced in real time.`,
    result:
      "60–70% of tasks handled locally at zero cost. Total monthly AI infrastructure targeting under €30. GDPR compliant by design. System runs autonomously — agents operate without user intervention.",
    stack: [
      "Mac Mini M4 Pro (24GB)",
      "Ollama",
      "Qwen3 14B",
      "Gemma 3 12B",
      "Claude Haiku",
      "Claude Sonnet",
      "Python",
      "Supabase",
      "Apple Vision OCR",
      "Hetzner VPS Frankfurt",
      "Google Drive API",
    ],
  },
  {
    title: "PropTech Platform",
    status: "Active Development",
    statusVariant: "blue",
    category: "Property Management · Web Application",
    problem:
      "Property management across multiple units involves repetitive document-heavy workflows — Mietverträge, WEG statements, utility bills, maintenance records, rental income tracking. All managed manually. All taking time that compounds across multiple properties.",
    approach:
      "Custom web application with AI document processing pipeline. Automated intake via a drop-zone folder — documents are classified, data extracted, and filed automatically. German property document types handled natively including Mietverträge, Betriebskostenabrechnungen, and WEG Protokolle. Foundation architected for commercial scale from day one.",
    result:
      "Platform in active development. Automated document intake pipeline operational. Architecture designed to scale from personal use to commercial PropTech product.",
    stack: [
      "Next.js",
      "Supabase",
      "Vercel",
      "Claude API",
      "GitHub CI/CD",
      "Python",
      "Apple Vision OCR",
    ],
  },
  {
    title: "AI Trading System",
    status: "Paper Trading Live",
    statusVariant: "green",
    category: "Investment Automation · Financial AI",
    problem:
      "Investment portfolio monitored manually. No systematic rebalancing. No real-time monitoring of EU and US market positions. No automated response to news, fund flows, or technical signals.",
    approach: `Automated trading system connected to Interactive Brokers Pro API. Three automation layers:
· Rule-based layer — systematic execution of rebalancing, stop-loss, position limits. Zero AI tokens. Runs 24/7.
· Signal layer — Claude analyses technicals, news sentiment, institutional fund flows. Generates buy/sell signals.
· Autonomous layer — Claude Desktop with IBKR MCP for on-demand natural language execution.

Infrastructure on Hetzner Frankfurt VPS for 24/7 uptime and stable IP. Multi-currency account holds EUR and USD natively — EU trades execute directly in EUR with no forced conversion.`,
    result:
      "Paper trading live on IBKR Pro. 60-day validation period before real capital deployment. Full data pipeline connected: Finnhub news sentiment, FRED macro data, ECB rates, SEC EDGAR 13F institutional flows.",
    stack: [
      "Python",
      "Interactive Brokers API",
      "IBKR MCP",
      "Hetzner VPS Frankfurt",
      "Supabase",
      "Claude API",
      "Finnhub API",
      "FRED API",
      "ECB API",
    ],
  },
];

function PreformattedText({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
      {text}
    </div>
  );
}

export default function WorkPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          What I <span className="gradient-text">Build</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Real systems solving real problems. Each project documented honestly — what worked,
          what failed, what it actually costs to run.
        </p>
      </section>

      {/* Case Studies */}
      <div className="flex flex-col gap-12">
        {caseStudies.map((cs, i) => (
          <article
            key={i}
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {/* Card header */}
            <div className="p-7 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={statusStyles[cs.statusVariant]}
                >
                  {cs.status}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  {cs.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{cs.title}</h2>
            </div>

            {/* Problem / Approach / Result */}
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {/* Problem */}
              <div className="px-7 py-5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--accent-1)" }}
                >
                  The Problem
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {cs.problem}
                </p>
              </div>

              {/* Approach */}
              <div className="px-7 py-5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--accent-1)" }}
                >
                  The Approach
                </h3>
                <PreformattedText text={cs.approach as string} />
              </div>

              {/* Result */}
              <div className="px-7 py-5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--accent-1)" }}
                >
                  The Result
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {cs.result}
                </p>
              </div>

              {/* Stack */}
              <div className="px-7 py-5">
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--muted)" }}
                >
                  Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cs.stack.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
