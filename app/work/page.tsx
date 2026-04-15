import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Real systems solving real problems. AI agent infrastructure, PropTech automation, and investment systems — documented honestly.",
};

type StatusVariant = "amber" | "blue" | "green";

const statusStyles: Record<StatusVariant, React.CSSProperties> = {
  amber: { background: "rgba(245,158,11,0.1)", color: "#d97706", border: "1px solid rgba(245,158,11,0.25)" },
  blue:  { background: "rgba(14,165,233,0.1)",  color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.25)" },
  green: { background: "rgba(34,197,94,0.1)",   color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" },
};

const content = {
  en: {
    heroStart: "What I",
    heroGradient: "Build",
    subtitle: "Real systems solving real problems. Each project documented honestly — what worked, what failed, what it actually costs to run.",
    labelProblem: "The Problem",
    labelApproach: "The Approach",
    labelResult: "The Result",
    labelStack: "Stack",
    cases: [
      {
        title: "AI Command Center",
        status: "In Development", statusVariant: "amber" as StatusVariant,
        category: "Personal Automation · AI Infrastructure",
        problem: "Property income and expenses across multiple units. WEG statements. Bills, receipts, and documents across dozens of categories. Eight years of self-filing complete German tax returns. All of it important. All of it repetitive. All of it eating my weekends.",
        approach: `Hybrid architecture — local Ollama models running on-device for privacy-sensitive document processing, Claude API reserved for tasks requiring genuine reasoning. Seven specialist agents governed by a machine-readable Constitution that enforces a hard monthly budget cap and privacy rules.\n\nSeven agents:\n· Supervisor Orchestrator — routes tasks, enforces Constitution, tracks spend\n· Tax Consultant — German tax law, Finanzamt documents, Elster filing\n· Financial Planner — portfolio tracking, ETF rebalancing, P&L reports\n· File Manager (The Librarian) — document classification, Google Drive organisation\n· Health Agent — reimbursement claims, health document management\n· Innovation Agent — AI news digest, research, idea capture\n· Business Operations Agent — invoice management, scheduling, client documents\n\nRouting logic: Sensitive documents processed locally via Apple Vision OCR — raw files never leave the device. Only anonymised values reach the cloud API. Cost governance enforced in real time.`,
        result: "60–70% of tasks handled locally at zero cost. Total monthly AI infrastructure targeting under €30. GDPR compliant by design. System runs autonomously — agents operate without user intervention.",
        stack: ["Mac Mini M4 Pro (24GB)", "Ollama", "Qwen3 14B", "Gemma 3 12B", "Claude Haiku", "Claude Sonnet", "Python", "Supabase", "Apple Vision OCR", "Hetzner VPS Frankfurt", "Google Drive API"],
      },
      {
        title: "PropTech Platform",
        status: "Active Development", statusVariant: "blue" as StatusVariant,
        category: "Property Management · Web Application",
        problem: "Property management across multiple units involves repetitive document-heavy workflows — Mietverträge, WEG statements, utility bills, maintenance records, rental income tracking. All managed manually. All taking time that compounds across multiple properties.",
        approach: "Custom web application with AI document processing pipeline. Automated intake via a drop-zone folder — documents are classified, data extracted, and filed automatically. German property document types handled natively including Mietverträge, Betriebskostenabrechnungen, and WEG Protokolle. Foundation architected for commercial scale from day one.",
        result: "Platform in active development. Automated document intake pipeline operational. Architecture designed to scale from personal use to commercial PropTech product.",
        stack: ["Next.js", "Supabase", "Vercel", "Claude API", "GitHub CI/CD", "Python", "Apple Vision OCR"],
      },
      {
        title: "AI Trading System",
        status: "Paper Trading Live", statusVariant: "green" as StatusVariant,
        category: "Investment Automation · Financial AI",
        problem: "Investment portfolio monitored manually. No systematic rebalancing. No real-time monitoring of EU and US market positions. No automated response to news, fund flows, or technical signals.",
        approach: `Automated trading system connected to Interactive Brokers Pro API. Three automation layers:\n· Rule-based layer — systematic execution of rebalancing, stop-loss, position limits. Zero AI tokens. Runs 24/7.\n· Signal layer — Claude analyses technicals, news sentiment, institutional fund flows. Generates buy/sell signals.\n· Autonomous layer — Claude Desktop with IBKR MCP for on-demand natural language execution.\n\nInfrastructure on Hetzner Frankfurt VPS for 24/7 uptime and stable IP. Multi-currency account holds EUR and USD natively — EU trades execute directly in EUR with no forced conversion.`,
        result: "Paper trading live on IBKR Pro. 60-day validation period before real capital deployment. Full data pipeline connected: Finnhub news sentiment, FRED macro data, ECB rates, SEC EDGAR 13F institutional flows.",
        stack: ["Python", "Interactive Brokers API", "IBKR MCP", "Hetzner VPS Frankfurt", "Supabase", "Claude API", "Finnhub API", "FRED API", "ECB API"],
      },
    ],
  },
  de: {
    heroStart: "Was ich",
    heroGradient: "Baue",
    subtitle: "Echte Systeme für echte Probleme. Jedes Projekt ehrlich dokumentiert — was funktioniert hat, was nicht, und was es tatsächlich kostet.",
    labelProblem: "Das Problem",
    labelApproach: "Der Ansatz",
    labelResult: "Das Ergebnis",
    labelStack: "Stack",
    cases: [
      {
        title: "KI-Kommandozentrale",
        status: "In Entwicklung", statusVariant: "amber" as StatusVariant,
        category: "Persönliche Automatisierung · KI-Infrastruktur",
        problem: "Mieteinnahmen und Ausgaben über mehrere Einheiten. WEG-Abrechnungen. Rechnungen, Belege und Dokumente in Dutzenden von Kategorien. Acht Jahre Selbsterstattung vollständiger deutscher Steuererklärungen. Alles wichtig. Alles repetitiv. Alles frisst meine Wochenenden.",
        approach: `Hybride Architektur — lokale Ollama-Modelle für datenschutzsensitive Dokumentenverarbeitung, Claude-API reserviert für Aufgaben, die echtes Reasoning erfordern. Sieben Spezialagenten, geregelt durch eine maschinenlesbare Verfassung mit hartem Monatsbudget und Datenschutzregeln.\n\nSieben Agenten:\n· Supervisor-Orchestrator — leitet Aufgaben weiter, setzt Verfassung durch, verfolgt Ausgaben\n· Steuerberater — deutsches Steuerrecht, Finanzamt-Dokumente, Elster-Einreichung\n· Finanzplaner — Portfolio-Tracking, ETF-Rebalancing, G&V-Berichte\n· Datei-Manager (Der Bibliothekar) — Dokumentenklassifizierung, Google Drive-Organisation\n· Gesundheitsagent — Erstattungsansprüche, Gesundheitsdokumentenverwaltung\n· Innovationsagent — KI-News-Digest, Recherche, Ideenerfassung\n· Business-Operations-Agent — Rechnungsverwaltung, Terminplanung, Kundendokumente\n\nRouting-Logik: Sensible Dokumente werden lokal über Apple Vision OCR verarbeitet — Rohdateien verlassen das Gerät nie. Nur anonymisierte Werte erreichen die Cloud-API. Kostenverwaltung in Echtzeit durchgesetzt.`,
        result: "60–70 % der Aufgaben werden lokal zum Nulltarif erledigt. Gesamte monatliche KI-Infrastruktur unter €30 angepeilt. DSGVO-konform by Design. Das System läuft autonom — Agenten arbeiten ohne Benutzereingriff.",
        stack: ["Mac Mini M4 Pro (24GB)", "Ollama", "Qwen3 14B", "Gemma 3 12B", "Claude Haiku", "Claude Sonnet", "Python", "Supabase", "Apple Vision OCR", "Hetzner VPS Frankfurt", "Google Drive API"],
      },
      {
        title: "PropTech-Plattform",
        status: "Aktive Entwicklung", statusVariant: "blue" as StatusVariant,
        category: "Immobilienverwaltung · Webanwendung",
        problem: "Die Verwaltung mehrerer Wohneinheiten beinhaltet wiederkehrende dokumentenintensive Abläufe — Mietverträge, WEG-Abrechnungen, Nebenkosten, Wartungsberichte, Mieteinnahmen-Tracking. Alles manuell verwaltet. Alles kostet Zeit, die sich über mehrere Objekte potenziert.",
        approach: "Maßgeschneiderte Webanwendung mit KI-Dokumentenverarbeitungspipeline. Automatisierter Eingang über einen Drop-Zone-Ordner — Dokumente werden klassifiziert, Daten extrahiert und automatisch abgelegt. Deutsche Immobiliendokumente nativ verarbeitet: Mietverträge, Betriebskostenabrechnungen und WEG-Protokolle. Architektur von Anfang an für gewerbliche Skalierung ausgelegt.",
        result: "Plattform in aktiver Entwicklung. Automatisierte Dokumenteneingangs-Pipeline in Betrieb. Architektur ausgelegt für Skalierung vom persönlichen Gebrauch zum kommerziellen PropTech-Produkt.",
        stack: ["Next.js", "Supabase", "Vercel", "Claude API", "GitHub CI/CD", "Python", "Apple Vision OCR"],
      },
      {
        title: "KI-Handelssystem",
        status: "Paper Trading Live", statusVariant: "green" as StatusVariant,
        category: "Investment-Automatisierung · Finanz-KI",
        problem: "Anlageportfolio manuell überwacht. Kein systematisches Rebalancing. Kein Echtzeit-Monitoring von EU- und US-Marktpositionen. Keine automatisierte Reaktion auf Nachrichten, Kapitalflüsse oder technische Signale.",
        approach: `Automatisiertes Handelssystem, verbunden mit der Interactive Brokers Pro API. Drei Automatisierungsschichten:\n· Regelbasierte Schicht — systematische Ausführung von Rebalancing, Stop-Loss, Positionslimits. Keine KI-Tokens. Läuft 24/7.\n· Signal-Schicht — Claude analysiert Technicals, News-Sentiment, institutionelle Kapitalflüsse. Generiert Kauf-/Verkaufssignale.\n· Autonome Schicht — Claude Desktop mit IBKR MCP für natürliche Sprachausführung auf Anfrage.\n\nInfrastruktur auf Hetzner Frankfurt VPS für 24/7-Betrieb. Multi-Währungskonto hält EUR und USD nativ — EU-Trades werden direkt in EUR ausgeführt.`,
        result: "Paper Trading live auf IBKR Pro. 60-Tage-Validierungsphase vor dem Einsatz echten Kapitals. Vollständige Datenpipeline verbunden: Finnhub-News-Sentiment, FRED-Makrodaten, EZB-Zinsen, SEC EDGAR 13F institutionelle Kapitalflüsse.",
        stack: ["Python", "Interactive Brokers API", "IBKR MCP", "Hetzner VPS Frankfurt", "Supabase", "Claude API", "Finnhub API", "FRED API", "ECB API"],
      },
    ],
  },
};

function PreformattedText({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
      {text}
    </div>
  );
}

export default async function WorkPage() {
  const locale = await getLocale();
  const c = content[locale];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {c.heroStart} <span className="gradient-text">{c.heroGradient}</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{c.subtitle}</p>
      </section>

      <div className="flex flex-col gap-12">
        {c.cases.map((cs, i) => (
          <article key={i} className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <div className="p-7 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={statusStyles[cs.statusVariant]}>
                  {cs.status}
                </span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{cs.category}</span>
              </div>
              <h2 className="text-2xl font-bold">{cs.title}</h2>
            </div>

            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              <div className="px-7 py-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                  {c.labelProblem}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{cs.problem}</p>
              </div>
              <div className="px-7 py-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                  {c.labelApproach}
                </h3>
                <PreformattedText text={cs.approach} />
              </div>
              <div className="px-7 py-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent-1)" }}>
                  {c.labelResult}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{cs.result}</p>
              </div>
              <div className="px-7 py-5">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>
                  {c.labelStack}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cs.stack.map((item) => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-full border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
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
