import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "10 Core Principles",
  description: "The non-negotiable rules governing every AI system I build — privacy, cost, oversight, and human control.",
};

interface Hat { role: string; question: string; }
interface Principle { number: string; title: string; body: string; intro?: string; hats?: Hat[]; closing?: string[]; }

const content = {
  en: {
    eyebrow: "How I build",
    title: "10 Core",
    titleGradient: "Principles",
    subtitle: "These are the non-negotiable rules that govern every AI system I design and operate. Not aspirations. Not guidelines. Hard constraints enforced at the architecture level.",
    footer: "These principles are documented publicly because accountability without transparency is theatre. If you are building AI systems and find them useful — they are yours to take.",
    principles: [
      { number: "01", title: "Privacy First — Data Stays Local", body: "Sensitive personal documents — tax records, bank statements, health data, legal contracts — are processed exclusively on-device using local OCR. Raw documents never reach any cloud API. Only anonymised, extracted values are passed upstream when reasoning is required. This is non-negotiable." },
      { number: "02", title: "EU Data Sovereignty", body: "All data storage, processing infrastructure, and cloud services operate within EU jurisdiction wherever possible. Servers in Frankfurt. Databases in EU regions. No sensitive data routed through non-EU providers. GDPR compliance is architecture — not a policy document." },
      { number: "03", title: "Cost Governed — Not Cost Estimated", body: "Total monthly AI infrastructure hard-capped at €40. Enforced by the Supervisor Agent in real time — not by manual checking. When the cap is reached, agents automatically degrade to local models and alert me. No exceptions. No surprise bills." },
      { number: "04", title: "Hybrid by Design", body: "Pure cloud violates privacy. Pure local lacks current knowledge. The correct architecture routes tasks by sensitivity and complexity — local models for private document processing, cloud API only when genuine reasoning is required. This is a deliberate design decision, not a compromise." },
      { number: "05", title: "Constitution-Governed Agents", body: "Every agent reads and operates within a machine-readable Constitution before executing any task. Agents cannot self-modify their boundaries, override cost limits, or expand their scope without a Constitution update. The Constitution is the single source of truth for all agent behaviour." },
      { number: "06", title: "Supervisor Agent — Command and Oversight", body: "All specialist agents report to a Supervisor Agent which coordinates tasks, enforces the Constitution, monitors budget consumption, and escalates anomalies directly to me. No agent operates independently of this oversight layer. The Supervisor reports to one person — me." },
      { number: "07", title: "Independent Audit Layer", body: "A dedicated set of audit agents operates independently of the specialist agents — monitoring output quality, checking decisions against Constitution rules, flagging anomalies, and reviewing agent-to-agent interactions. Audit agents have no execution capability — they observe, assess, and report only. No agent marks its own homework." },
      { number: "08", title: "Full Logging — No Exceptions", body: "Every agent action is logged with timestamp, model used, tokens consumed, decision made, and outcome. No agent executes any task without a corresponding audit trail. Logs are immutable, stored in Supabase, and reviewable at any time. If it is not logged, it did not happen." },
      { number: "09", title: "Human Decision Threshold — €550", body: "Any decision, transaction, commitment, or action involving a value above €550 requires mandatory human approval before execution. The Supervisor Agent surfaces these decisions directly to me with full context. Agents propose. I decide. This threshold applies to financial transactions, contract commitments, and any irreversible action above this value." },
      {
        number: "10", title: "Multi-Perspective Validation — Wearing Every Hat", body: "",
        intro: "AI is an excellent assistant. Fast, thorough, and occasionally brilliant. It is also confidently wrong in ways that only human experience across multiple perspectives can catch.",
        hats: [
          { role: "Builder",     question: "Is this actually implementable or just elegant on paper?" },
          { role: "Product",     question: "Does this solve the real problem or just the stated one?" },
          { role: "User",        question: "Would a non-technical person actually use this daily?" },
          { role: "Operations",  question: "Can this run reliably at 3 AM with no one watching?" },
          { role: "Security",    question: "Does this introduce risk? What is the attack surface? What data could leak?" },
          { role: "Commercial",  question: "What does this cost at scale? What is the three-year number?" },
          { role: "Strategic",   question: "Does this move toward the vision or just feel productive?" },
        ],
        closing: [
          "Twenty-two years of enterprise delivery across nine companies, industries, and geographies — plus managing my own properties, finances, and tax filings in Germany for eleven years — has given me genuine lived perspective from each of these angles.",
          "I will not always have the right answer wearing each hat. But asking the question from each angle is often enough to catch what AI confidently misses.",
          "That is the human judgment layer no agent replaces.",
        ],
      },
    ] as Principle[],
  },
  de: {
    eyebrow: "Wie ich baue",
    title: "10 Kern-",
    titleGradient: "Prinzipien",
    subtitle: "Das sind die unveräußerlichen Regeln, die jedes KI-System regeln, das ich entwerfe und betreibe. Keine Ansprüche. Keine Richtlinien. Harte Einschränkungen, die auf Architekturebene durchgesetzt werden.",
    footer: "Diese Prinzipien werden öffentlich dokumentiert, weil Verantwortlichkeit ohne Transparenz Theater ist. Wenn Sie KI-Systeme bauen und sie nützlich finden — sie gehören Ihnen.",
    principles: [
      { number: "01", title: "Datenschutz zuerst — Daten bleiben lokal", body: "Sensible persönliche Dokumente — Steuererklärungen, Kontoauszüge, Gesundheitsdaten, Verträge — werden ausschließlich lokal per OCR verarbeitet. Rohdokumente erreichen keine Cloud-API. Nur anonymisierte, extrahierte Werte werden weitergegeben, wenn Reasoning erforderlich ist. Das ist nicht verhandelbar." },
      { number: "02", title: "EU-Datensouveränität", body: "Alle Datenspeicherung, Verarbeitungsinfrastruktur und Cloud-Dienste operieren wo immer möglich innerhalb der EU-Jurisdiktion. Server in Frankfurt. Datenbanken in EU-Regionen. Keine sensiblen Daten über Nicht-EU-Anbieter. DSGVO-Compliance ist Architektur — kein Policy-Dokument." },
      { number: "03", title: "Kosten gesteuert — nicht geschätzt", body: "Gesamte monatliche KI-Infrastruktur hart auf €40 gedeckelt. Vom Supervisor-Agenten in Echtzeit durchgesetzt — nicht durch manuelle Kontrolle. Wenn das Limit erreicht ist, degradieren Agenten automatisch auf lokale Modelle und benachrichtigen mich. Keine Ausnahmen. Keine Überraschungsrechnungen." },
      { number: "04", title: "Hybrid by Design", body: "Reine Cloud verletzt den Datenschutz. Rein lokal fehlt aktuelles Wissen. Die richtige Architektur leitet Aufgaben nach Sensitivität und Komplexität — lokale Modelle für private Dokumentenverarbeitung, Cloud-API nur wenn echtes Reasoning erforderlich ist. Das ist eine bewusste Designentscheidung, kein Kompromiss." },
      { number: "05", title: "Verfassungsgesteuerte Agenten", body: "Jeder Agent liest und arbeitet innerhalb einer maschinenlesbaren Verfassung, bevor er eine Aufgabe ausführt. Agenten können ihre Grenzen nicht selbst ändern, Kostenlimits überschreiben oder ihren Umfang ohne Verfassungsänderung erweitern. Die Verfassung ist die einzige Wahrheitsquelle für das gesamte Agentenverhalten." },
      { number: "06", title: "Supervisor-Agent — Führung und Aufsicht", body: "Alle Spezialagenten berichten an einen Supervisor-Agenten, der Aufgaben koordiniert, die Verfassung durchsetzt, den Budgetverbrauch überwacht und Anomalien direkt an mich eskaliert. Kein Agent arbeitet unabhängig von dieser Aufsichtsebene. Der Supervisor berichtet an eine Person — mich." },
      { number: "07", title: "Unabhängige Prüfschicht", body: "Ein dediziertes Set von Prüfagenten arbeitet unabhängig von den Spezialagenten — überwacht Ausgabequalität, prüft Entscheidungen gegen Verfassungsregeln, markiert Anomalien und prüft Agenten-zu-Agenten-Interaktionen. Prüfagenten haben keine Ausführungsfähigkeit — sie beobachten, bewerten und berichten nur. Kein Agent bewertet seine eigenen Hausaufgaben." },
      { number: "08", title: "Vollständiges Logging — keine Ausnahmen", body: "Jede Agentenaktion wird mit Zeitstempel, verwendetem Modell, verbrauchten Tokens, getroffener Entscheidung und Ergebnis protokolliert. Kein Agent führt eine Aufgabe ohne entsprechende Prüfspur aus. Logs sind unveränderlich, in Supabase gespeichert und jederzeit überprüfbar. Wenn es nicht protokolliert ist, ist es nicht passiert." },
      { number: "09", title: "Mensch-Entscheidungsschwelle — €550", body: "Jede Entscheidung, Transaktion, Verpflichtung oder Aktion mit einem Wert über €550 erfordert eine obligatorische menschliche Genehmigung vor der Ausführung. Der Supervisor-Agent bringt diese Entscheidungen direkt mit vollem Kontext zu mir. Agenten schlagen vor. Ich entscheide. Diese Schwelle gilt für Finanztransaktionen, Vertragsverpflichtungen und jede irreversible Aktion über diesem Wert." },
      {
        number: "10", title: "Multi-Perspektiven-Validierung — Alle Rollen einnehmen", body: "",
        intro: "KI ist ein ausgezeichneter Assistent. Schnell, gründlich und gelegentlich brilliant. Sie liegt auch selbstbewusst falsch auf Weisen, die nur menschliche Erfahrung aus mehreren Perspektiven erkennen kann.",
        hats: [
          { role: "Entwickler",   question: "Ist das tatsächlich umsetzbar oder nur auf dem Papier elegant?" },
          { role: "Produkt",      question: "Löst das das echte Problem oder nur das genannte?" },
          { role: "Nutzer",       question: "Würde ein nicht-technischer Mensch das täglich nutzen?" },
          { role: "Betrieb",      question: "Kann das zuverlässig um 3 Uhr morgens ohne Überwachung laufen?" },
          { role: "Sicherheit",   question: "Birgt das Risiken? Wie groß ist die Angriffsfläche? Welche Daten könnten leaken?" },
          { role: "Kommerziell",  question: "Was kostet das in der Skalierung? Wie ist die Drei-Jahres-Zahl?" },
          { role: "Strategisch",  question: "Bewegt sich das in Richtung der Vision oder fühlt es sich nur produktiv an?" },
        ],
        closing: [
          "22 Jahre Enterprise-Delivery über neun Unternehmen, Branchen und Geographien — plus Verwaltung meiner eigenen Immobilien, Finanzen und Steuererklärungen in Deutschland seit elf Jahren — hat mir echte gelebte Perspektive aus jedem dieser Blickwinkel gegeben.",
          "Ich werde nicht immer die richtige Antwort in jeder Rolle haben. Aber die Frage aus jedem Winkel zu stellen, reicht oft aus, um zu erkennen, was KI selbstbewusst verpasst.",
          "Das ist die menschliche Urteilsebene, die kein Agent ersetzt.",
        ],
      },
    ] as Principle[],
  },
};

export default async function PrinciplesPage() {
  const locale = await getLocale();
  const c = content[locale];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <section className="mb-16">
        <p className="text-xs font-bold uppercase tracking-widest gradient-text mb-3">{c.eyebrow}</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          {c.title} <span className="gradient-text">{c.titleGradient}</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{c.subtitle}</p>
      </section>

      <div className="flex flex-col gap-4">
        {c.principles.map((p) => (
          <article key={p.number}
            className="group relative rounded-2xl border overflow-hidden transition-colors duration-200 hover:border-sky-500/40"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="px-7 py-6 pl-8">
              <div className="flex items-start gap-5">
                <span className="shrink-0 text-3xl font-black leading-none gradient-text opacity-30 group-hover:opacity-70 transition-opacity duration-200 select-none" aria-hidden="true">
                  {p.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-base sm:text-lg mb-2 leading-snug">{p.title}</h2>
                  {p.body && <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{p.body}</p>}
                  {p.intro && (
                    <>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>{p.intro}</p>
                      {p.hats && (
                        <div className="rounded-xl border divide-y mb-5" style={{ borderColor: "var(--border)" }}>
                          {p.hats.map((hat) => (
                            <div key={hat.role} className="flex items-baseline gap-3 px-4 py-3" style={{ borderColor: "var(--border)" }}>
                              <span className="shrink-0 text-xs font-bold uppercase tracking-wider w-24" style={{ color: "var(--accent-1)" }}>{hat.role}</span>
                              <span className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{hat.question}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {p.closing && (
                        <div className="flex flex-col gap-3">
                          {p.closing.map((line, i) => (
                            <p key={i}
                              className={`text-sm leading-relaxed${i === p.closing!.length - 1 ? " font-semibold" : ""}`}
                              style={{ color: i === p.closing!.length - 1 ? "var(--foreground)" : "var(--muted)" }}>
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

      <p className="mt-12 text-sm text-center leading-relaxed" style={{ color: "var(--muted)" }}>
        {c.footer}
      </p>
    </div>
  );
}
