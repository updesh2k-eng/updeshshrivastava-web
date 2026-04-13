import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10 Core Principles",
  description:
    "The non-negotiable rules governing every AI system I build — privacy, cost, oversight, and human control.",
};

interface Hat {
  role: string;
  question: string;
}

interface Principle {
  number: string;
  title: string;
  body: string;
  intro?: string;
  hats?: Hat[];
  closing?: string[];
}

const principles: Principle[] = [
  {
    number: "01",
    title: "Privacy First — Data Stays Local",
    body: "Sensitive personal documents — tax records, bank statements, health data, legal contracts — are processed exclusively on-device using local OCR. Raw documents never reach any cloud API. Only anonymised, extracted values are passed upstream when reasoning is required. This is non-negotiable.",
  },
  {
    number: "02",
    title: "EU Data Sovereignty",
    body: "All data storage, processing infrastructure, and cloud services operate within EU jurisdiction wherever possible. Servers in Frankfurt. Databases in EU regions. No sensitive data routed through non-EU providers. GDPR compliance is architecture — not a policy document.",
  },
  {
    number: "03",
    title: "Cost Governed — Not Cost Estimated",
    body: "Total monthly AI infrastructure hard-capped at €40. Enforced by the Supervisor Agent in real time — not by manual checking. When the cap is reached, agents automatically degrade to local models and alert me. No exceptions. No surprise bills.",
  },
  {
    number: "04",
    title: "Hybrid by Design",
    body: "Pure cloud violates privacy. Pure local lacks current knowledge. The correct architecture routes tasks by sensitivity and complexity — local models for private document processing, cloud API only when genuine reasoning is required. This is a deliberate design decision, not a compromise.",
  },
  {
    number: "05",
    title: "Constitution-Governed Agents",
    body: "Every agent reads and operates within a machine-readable Constitution before executing any task. Agents cannot self-modify their boundaries, override cost limits, or expand their scope without a Constitution update. The Constitution is the single source of truth for all agent behaviour.",
  },
  {
    number: "06",
    title: "Supervisor Agent — Command and Oversight",
    body: "All specialist agents report to a Supervisor Agent which coordinates tasks, enforces the Constitution, monitors budget consumption, and escalates anomalies directly to me. No agent operates independently of this oversight layer. The Supervisor reports to one person — me.",
  },
  {
    number: "07",
    title: "Independent Audit Layer",
    body: "A dedicated set of audit agents operates independently of the specialist agents — monitoring output quality, checking decisions against Constitution rules, flagging anomalies, and reviewing agent-to-agent interactions. Audit agents have no execution capability — they observe, assess, and report only. No agent marks its own homework.",
  },
  {
    number: "08",
    title: "Full Logging — No Exceptions",
    body: "Every agent action is logged with timestamp, model used, tokens consumed, decision made, and outcome. No agent executes any task without a corresponding audit trail. Logs are immutable, stored in Supabase, and reviewable at any time. If it is not logged, it did not happen.",
  },
  {
    number: "09",
    title: "Human Decision Threshold — €550",
    body: "Any decision, transaction, commitment, or action involving a value above €550 requires mandatory human approval before execution. The Supervisor Agent surfaces these decisions directly to me with full context. Agents propose. I decide. This threshold applies to financial transactions, contract commitments, and any irreversible action above this value.",
  },
  {
    number: "10",
    title: "Multi-Perspective Validation — Wearing Every Hat",
    body: "",
    intro:
      "AI is an excellent assistant. Fast, thorough, and occasionally brilliant. It is also confidently wrong in ways that only human experience across multiple perspectives can catch.",
    hats: [
      {
        role: "Builder",
        question: "Is this actually implementable or just elegant on paper?",
      },
      {
        role: "Product",
        question: "Does this solve the real problem or just the stated one?",
      },
      {
        role: "User",
        question: "Would a non-technical person actually use this daily?",
      },
      {
        role: "Operations",
        question: "Can this run reliably at 3 AM with no one watching?",
      },
      {
        role: "Security",
        question:
          "Does this introduce risk? What is the attack surface? What data could leak?",
      },
      {
        role: "Commercial",
        question: "What does this cost at scale? What is the three-year number?",
      },
      {
        role: "Strategic",
        question:
          "Does this move toward the vision or just feel productive?",
      },
    ],
    closing: [
      "Twenty-two years of enterprise delivery across nine companies, industries, and geographies — plus managing my own properties, finances, and tax filings in Germany for eleven years — has given me genuine lived perspective from each of these angles.",
      "I will not always have the right answer wearing each hat. But asking the question from each angle is often enough to catch what AI confidently misses.",
      "That is the human judgment layer no agent replaces.",
    ],
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
          10 Core <span className="gradient-text">Principles</span>
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
            <div className="absolute left-0 top-0 bottom-0 w-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="px-7 py-6 pl-8">
              <div className="flex items-start gap-5">
                {/* Number */}
                <span
                  className="shrink-0 text-3xl font-black leading-none gradient-text opacity-30 group-hover:opacity-70 transition-opacity duration-200 select-none"
                  aria-hidden="true"
                >
                  {p.number}
                </span>

                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base sm:text-lg mb-2 leading-snug">
                    {p.title}
                  </h2>

                  {/* Simple body (principles 01–09) */}
                  {p.body && (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {p.body}
                    </p>
                  )}

                  {/* Rich body (principle 10) */}
                  {p.intro && (
                    <>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
                        {p.intro}
                      </p>

                      {/* Hats list */}
                      {p.hats && (
                        <div
                          className="rounded-xl border divide-y mb-5"
                          style={{ borderColor: "var(--border)" }}
                        >
                          {p.hats.map((hat) => (
                            <div
                              key={hat.role}
                              className="flex items-baseline gap-3 px-4 py-3"
                              style={{ borderColor: "var(--border)" }}
                            >
                              <span
                                className="shrink-0 text-xs font-bold uppercase tracking-wider w-24"
                                style={{ color: "var(--accent-1)" }}
                              >
                                {hat.role}
                              </span>
                              <span
                                className="text-sm leading-relaxed"
                                style={{ color: "var(--muted)" }}
                              >
                                {hat.question}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Closing paragraphs */}
                      {p.closing && (
                        <div className="flex flex-col gap-3">
                          {p.closing.map((line, i) => (
                            <p
                              key={i}
                              className={`text-sm leading-relaxed${
                                i === p.closing!.length - 1
                                  ? " font-semibold"
                                  : ""
                              }`}
                              style={{
                                color:
                                  i === p.closing!.length - 1
                                    ? "var(--foreground)"
                                    : "var(--muted)",
                              }}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}
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
