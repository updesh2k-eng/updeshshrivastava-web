import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty-two years of enterprise technology delivery — from Java and PLM consultancy to AI agent systems. Senior PM, AI Systems Builder, Nürnberg.",
};

const content = {
  en: {
    heroStart: "Twenty-two years ago I wrote Java.",
    heroEnd: "Today I build AI agent systems.",
    lead: "Senior PM · AI Systems Builder · Lead Consultant · Nürnberg, Germany",
    journeyTitle: "The Journey",
    story: [
      "I started as a Software Engineer writing Java and J2EE applications fresh out of university. Within a year I was deep in PLM and Enovia consultancy — a niche that took me across some of the most complex engineering environments in the world: Texas Instruments, NCR Corporation, IBM, and eventually Adidas through Infosys.",
      "The pivot to Product came naturally. After nearly a decade as a PLM technical expert, I moved into Technical Product Owner and then Senior Product Manager roles at GfK SE in Nürnberg — spending six years driving legacy transformation across Retail, Hi-Tech, and Consumer Goods analytics at one of Germany's most respected market intelligence companies.",
      "In 2026 I stopped reading about AI and started building with it. The catalyst was simple: I had real problems — property documents, German tax filings, investment monitoring — eating my weekends. I decided the best way to understand AI's real capabilities was to apply it to problems I already knew intimately. What I built and what I learned is what I document here.",
    ],
    timelineTitle: "22 Years · 9 Companies · 6 Industries",
    newestFirst: "Newest first",
    industriesTitle: "Industries",
    educationTitle: "Education",
    basedTitle: "Based in Nürnberg",
    basedBody:
      "Indian-born, German citizen. I have lived and worked in Germany for eleven years. I understand the EU regulatory context — GDPR, German tax law, Mietrecht, Betriebsrat — that makes AI automation genuinely different here than anywhere else in the world. This is not a footnote. It is the entire point of what I build.",
    ctaTitle: "Want to work together?",
    ctaBody: "See what I build or start a conversation.",
    ctaWork: "My Work",
    ctaContact: "Contact",
    timeline: [
      { period: "2023 – Present", role: "Lead Consultant", company: "Infosys / Herzogenaurach", detail: "Leading Adidas PAPP Sustainability implementation. BA leadership, cross-team requirements, user stories, stakeholder engagement." },
      { period: "2020 – 2023", role: "Senior Product Manager", company: "GfK SE (an NIQ Company) · Nürnberg", detail: "Drove legacy transformation across Retail, Technical and Consumer Goods market insights. Shaped product vision, client collaboration, data-driven roadmaps." },
      { period: "2017 – 2020", role: "Senior Technical Product Owner", company: "GfK SE · Nürnberg", detail: "Complete backlog ownership, Scrum team alignment, business requirements. Advanced Confluence and JIRA customisation." },
      { period: "2015 – 2017", role: "Business Analyst — PLM Enovia", company: "Infosys / Herzogenaurach", detail: "PLM consultancy for Adidas. PDM coordination, functional documentation, end-to-end testing." },
      { period: "2012 – 2015", role: "PLM Consultant — Enovia", company: "Infosys Limited", detail: "Level 2 support for Texas Instruments. Managed upgrades, design documentation, enhancements, data migration." },
      { period: "2011 – 2012", role: "Technical SME — Enovia", company: "NCR Corporation", detail: "Core PLM development role. Led testing, supported production releases." },
      { period: "2010 – 2011", role: "Team Lead — Enovia PLM", company: "IBM India Pvt Ltd", detail: "Led technical team for Oil and Gas clients. Managed PLM implementations and business requirements." },
      { period: "2007 – 2010", role: "Senior Software Engineer", company: "Teradata India Pvt Ltd", detail: "Managed Enovia-based systems. Performed enhancements and system support." },
      { period: "2005 – 2007", role: "Project Engineer", company: "Wipro Technologies", detail: "Chip Manufacturing domain. Design applications and unit testing." },
      { period: "2004 – 2005", role: "Software Engineer", company: "Birlasoft Ltd", detail: "Java/J2EE applications for General Electric. Enovia and PLM training." },
    ],
    industries: ["Hi-Tech", "Retail (Apparel & Footwear)", "Data Science & Analytics", "Energy & Oil & Gas", "Chip Design & Semiconductor", "Product Lifecycle Management"],
    education: [
      { degree: "Post Graduate Diploma in Business Administration", institution: "Symbiosis Institute · Pune, India", period: "2006 – 2008" },
      { degree: "Bachelor of Technology — Information Technology", institution: "UP Technical University · Lucknow, India", period: "2001 – 2004" },
      { degree: "Advanced Diploma in Computer Applications", institution: "Indian Ministry of Communications and Information Technology · Delhi", period: "2000 – 2001" },
    ],
  },
  de: {
    heroStart: "Vor 22 Jahren schrieb ich Java.",
    heroEnd: "Heute baue ich KI-Agentensysteme.",
    lead: "Senior PM · KI-Systeme-Entwickler · Lead Consultant · Nürnberg",
    journeyTitle: "Die Reise",
    story: [
      "Ich begann als Softwareentwickler und schrieb Java- und J2EE-Anwendungen direkt nach dem Studium. Innerhalb eines Jahres war ich tief in PLM- und Enovia-Beratung — eine Nische, die mich durch einige der komplexesten Ingenieursumgebungen der Welt führte: Texas Instruments, NCR Corporation, IBM und schließlich Adidas über Infosys.",
      "Der Wechsel in den Produktbereich kam natürlich. Nach fast einem Jahrzehnt als PLM-Technikexperte wechselte ich in Rollen als Technical Product Owner und dann als Senior Product Manager bei GfK SE in Nürnberg — sechs Jahre lang trieb ich die Legacy-Transformation im Bereich Retail, Hi-Tech und Konsumgüteranalyse bei einem der renommiertesten Marktforschungsunternehmen Deutschlands voran.",
      "2026 hörte ich auf, über KI zu lesen, und begann, damit zu bauen. Der Auslöser war einfach: Ich hatte echte Probleme — Grundstücksdokumente, deutsche Steuererklärungen, Investitionsmonitoring — die meine Wochenenden fraßen. Ich entschied, dass der beste Weg, die realen Fähigkeiten der KI zu verstehen, darin bestand, sie auf Probleme anzuwenden, die ich bereits gut kannte. Was ich baute und lernte, dokumentiere ich hier.",
    ],
    timelineTitle: "22 Jahre · 9 Unternehmen · 6 Branchen",
    newestFirst: "Neueste zuerst",
    industriesTitle: "Branchen",
    educationTitle: "Ausbildung",
    basedTitle: "Wohnhaft in Nürnberg",
    basedBody:
      "In Indien geboren, deutscher Staatsbürger. Ich lebe und arbeite seit elf Jahren in Deutschland. Ich verstehe den europäischen Regulierungskontext — DSGVO, deutsches Steuerrecht, Mietrecht, Betriebsrat — der KI-Automatisierung hier grundlegend anders macht als anderswo auf der Welt. Das ist keine Fußnote. Es ist der eigentliche Kern dessen, was ich baue.",
    ctaTitle: "Zusammenarbeiten?",
    ctaBody: "Schau dir an, was ich baue, oder starte ein Gespräch.",
    ctaWork: "Meine Projekte",
    ctaContact: "Kontakt",
    timeline: [
      { period: "2023 – heute", role: "Lead Consultant", company: "Infosys / Herzogenaurach", detail: "Leitung der Adidas PAPP Nachhaltigkeitsimplementierung. BA-Führung, teamübergreifende Anforderungen, User Stories, Stakeholder-Management." },
      { period: "2020 – 2023", role: "Senior Product Manager", company: "GfK SE (ein NIQ-Unternehmen) · Nürnberg", detail: "Vorantreiben der Legacy-Transformation in den Bereichen Retail, Technik und Konsumgüter-Markteinblicke. Produktvision, Kundenzusammenarbeit, datengetriebene Roadmaps." },
      { period: "2017 – 2020", role: "Senior Technical Product Owner", company: "GfK SE · Nürnberg", detail: "Vollständige Backlog-Verantwortung, Scrum-Team-Abstimmung, Geschäftsanforderungen. Erweiterte Confluence- und JIRA-Anpassung." },
      { period: "2015 – 2017", role: "Business Analyst — PLM Enovia", company: "Infosys / Herzogenaurach", detail: "PLM-Beratung für Adidas. PDM-Koordination, funktionale Dokumentation, End-to-End-Tests." },
      { period: "2012 – 2015", role: "PLM Consultant — Enovia", company: "Infosys Limited", detail: "Level-2-Support für Texas Instruments. Verwaltung von Upgrades, Design-Dokumentation, Erweiterungen, Datenmigration." },
      { period: "2011 – 2012", role: "Technical SME — Enovia", company: "NCR Corporation", detail: "Kernrolle in der PLM-Entwicklung. Leitung von Tests, Unterstützung bei Produktionsreleases." },
      { period: "2010 – 2011", role: "Team Lead — Enovia PLM", company: "IBM India Pvt Ltd", detail: "Leitung des technischen Teams für Öl- und Gaskunden. Verwaltung von PLM-Implementierungen und Geschäftsanforderungen." },
      { period: "2007 – 2010", role: "Senior Software Engineer", company: "Teradata India Pvt Ltd", detail: "Verwaltung von Enovia-basierten Systemen. Durchführung von Erweiterungen und Systemsupport." },
      { period: "2005 – 2007", role: "Project Engineer", company: "Wipro Technologies", detail: "Halbleiterbereich. Entwurfsanwendungen und Unit-Tests." },
      { period: "2004 – 2005", role: "Software Engineer", company: "Birlasoft Ltd", detail: "Java/J2EE-Anwendungen für General Electric. Enovia- und PLM-Schulung." },
    ],
    industries: ["Hi-Tech", "Einzelhandel (Bekleidung & Schuhe)", "Data Science & Analytik", "Energie & Öl & Gas", "Chip-Design & Halbleiter", "Product Lifecycle Management"],
    education: [
      { degree: "Postgraduales Diplom in Betriebswirtschaft", institution: "Symbiosis Institute · Pune, Indien", period: "2006 – 2008" },
      { degree: "Bachelor of Technology — Informationstechnologie", institution: "UP Technical University · Lucknow, Indien", period: "2001 – 2004" },
      { degree: "Fortgeschrittenes Diplom in Computeranwendungen", institution: "Indisches Ministerium für Kommunikation und IT · Delhi", period: "2000 – 2001" },
    ],
  },
};

export default async function AboutPage() {
  const locale = await getLocale();
  const c = content[locale];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          {c.heroStart}{" "}
          <span className="gradient-text">{c.heroEnd}</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base font-medium" style={{ color: "var(--muted)" }}>
          {c.lead}
        </p>
      </section>

      {/* Story */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{c.journeyTitle}</h2>
        <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          {c.story.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">{c.timelineTitle}</h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>{c.newestFirst}</p>
        <div className="relative pl-6 border-l" style={{ borderColor: "var(--border)" }}>
          {c.timeline.map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              <div
                className="absolute -left-[25px] w-3 h-3 rounded-full gradient-bg ring-2 ring-offset-2"
                style={{ ringOffsetColor: "var(--background)" } as React.CSSProperties}
              />
              <p className="text-xs font-bold uppercase tracking-widest mb-1 gradient-text">{item.period}</p>
              <h3 className="font-semibold text-base leading-snug">{item.role}</h3>
              <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>{item.company}</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{c.industriesTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {c.industries.map((ind) => (
            <span key={ind} className="text-sm px-4 py-2 rounded-full border font-medium"
              style={{ borderColor: "var(--accent-1)", color: "var(--accent-1)", background: "rgba(14,165,233,0.06)" }}>
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{c.educationTitle}</h2>
        <div className="flex flex-col gap-4">
          {c.education.map((edu, i) => (
            <div key={i} className="p-5 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <p className="font-semibold text-sm mb-1">{edu.degree}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{edu.institution}</p>
              <p className="text-xs mt-1 gradient-text font-semibold">{edu.period}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Based in */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">{c.basedTitle}</h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{c.basedBody}</p>
      </section>

      {/* CTA */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div>
            <h3 className="font-semibold mb-1">{c.ctaTitle}</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{c.ctaBody}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90 transition-opacity">
              {c.ctaWork} <ArrowUpRight size={14} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border hover:opacity-70 transition-opacity"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>
              {c.ctaContact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
