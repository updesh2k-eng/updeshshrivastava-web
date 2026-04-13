import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "9 Core Principles",
  description:
    "The non-negotiable rules governing every AI system I build — privacy, cost, oversight, and human control.",
};

const principles = [
  {
    number: "01",
    title: "Privacy First — Data Stays Local",
    body: "Sensitive personal documents — tax records, bank statements, health data, legal contracts — are processed exclusively on-device using local OCR. Raw documents never reach any cloud API. Only anonymised, extracted values are passed upstream when reasoning is required. This is non-negotiable.",
    accent: "bg-sky-500",
  },
  {
    number: "02",
    title: "EU Data Sovereignty",
    body: "All data storage, processing infrastructure, and cloud services operate within EU jurisdiction wherever possible. Servers in Frankfurt. Databases in EU regions. No sensitive data routed through non-EU providers. GDPR compliance is architecture — not a policy document.",
    accent: "bg-sky-500",
  },
  {
    number: "03",
    title: "Cost Governed — Not Cost Estimated",
    body: "Total monthly AI infrastructure hard-capped at €40. Enforced by the Supervisor Agent in real time — not by manual checking. When the cap is reached, agents automatically degrade to local models and alert me. No exceptions. No surprise bills.",
    accent: "bg-sky-500",
  },
  {
    number: "04",
    title: "Hybrid by Design",
    body: "Pure cloud violates privacy. Pure local lacks current knowledge. The correct architecture routes tasks by sensitivity and complexity — local models for private document processing, cloud API only when genuine reasoning is required. This is a deliberate design decision, not a compromise.",
    accent: "bg-sky-500",
  },
  {
    number: "05",
    title: "Constitution-Governed Agents",
    body: "Every agent reads and operates within a machine-readable Constitution before executing any task. Agents cannot self-modify their boundaries, override cost limits, or expand their scope without a Constitution update. The Constitution is the single source of truth for all agent behaviour.",
    accent: "bg-sky-500",
  },
  {
    number: "06",
    title: "Supervisor Agent — Command and Oversight",
    body: "All specialist agents report to a Supervisor Agent which coordinates tasks, enforces the Constitution, monitors budget consumption, and escalates anomalies directly to me. No agent operates independently of this oversight layer. The Supervisor reports to one person — me.",
    accent: "bg-sky-500",
  },
  {
    number: "07",
    title: "Independent Audit Layer",
    body: "A dedicated set of audit agents operates independently of the specialist agents — monitoring output quality, checking decisions against Constitution rules, flagging anomalies, and reviewing agent-to-agent interactions. Audit agents have no execution capability — they observe, assess, and report only. No agent marks its own homework.",
    accent: "bg-sky-500",
  },
  {
    number: "08",
    title: "Full Logging — No Exceptions",
    body: "Every agent action is logged with timestamp, model used, tokens consumed, decision made, and outcome. No agent executes any task without a corresponding audit trail. Logs are immutable, stored in Supabase, and reviewable at any time. If it is not logged, it did not happen.",
    accent: "bg-sky-500",
  },
  {
    number: "09",
    title: "Human Decision Threshold — €550",
    body: "Any decision, transaction, commitment, or action involving a value above €550 requires mandatory human approval before execution. The Supervisor Agent surfaces these decisions directly to me with full context. Agents propose. I decide. This threshold applies to financial transactions, contract commitments, and any irreversible action above this value.",
    accent: "bg-sky-500",
  },
];

export default function PrinciplesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      {/* Header */}
      <section className="mb-16">
        <p className="text-xs font-bold uppercase tracking-widest gradient-text mb-3">
          How I build
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          9 Core <span className="gradient-text">Principles</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          These are the non-negotiable rules that govern every AI system I design and operate.
          Not aspirations. Not guidelines. Hard constraints enforced at the architecture level.
        </p>
      </section>

      {/* Principles */}
      <div className="flex flex-col gap-4">
        {principles.map((p) => (
          <article
            key={p.number}
            className="group relative rounded-2xl border overflow-hidden transition-colors duration-200 hover:border-sky-500/40"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />

            <div className="px-7 py-6 pl-8">
              <div className="flex items-start gap-5">
                {/* Number */}
                <span
                  className="shrink-0 text-3xl font-black leading-none gradient-text opacity-30 group-hover:opacity-70 transition-opacity duration-200 select-none"
                  aria-hidden="true"
                >
                  {p.number}
                </span>

                <div>
                  <h2 className="font-bold text-base sm:text-lg mb-2 leading-snug">
                    {p.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="mt-12 text-sm text-center leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        These principles are documented publicly because accountability without transparency
        is theatre. If you are building AI systems and find them useful — they are yours to
        take.
      </p>
    </div>
  );
}
