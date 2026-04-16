import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLocale } from "@/lib/i18n";
import { LinkedInBadge } from "@/components/LinkedInBadge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty-two years of enterprise technology delivery — from Java and PLM consultancy to AI agent systems. Senior PM, AI Systems Builder, Nürnberg.",
};

const timeline = [
  {
    period: "2023 – Present",
    role: "Lead Consultant",
    company: "Infosys / Herzogenaurach",
    detail:
      "Leading Adidas PAPP Sustainability implementation. BA leadership, cross-team requirements, user stories, stakeholder engagement.",
  },
  {
    period: "2020 – 2023",
    role: "Senior Product Manager",
    company: "GfK SE (an NIQ Company) · Nürnberg",
    detail:
      "Drove legacy transformation across Retail, Technical and Consumer Goods market insights. Shaped product vision, client collaboration, data-driven roadmaps.",
  },
  {
    period: "2017 – 2020",
    role: "Senior Technical Product Owner",
    company: "GfK SE · Nürnberg",
    detail:
      "Complete backlog ownership, Scrum team alignment, business requirements. Advanced Confluence and JIRA customisation.",
  },
  {
    period: "2015 – 2017",
    role: "Business Analyst — PLM Enovia",
    company: "Infosys / Herzogenaurach",
    detail:
      "PLM consultancy for Adidas. PDM coordination, functional documentation, end-to-end testing.",
  },
  {
    period: "2012 – 2015",
    role: "PLM Consultant — Enovia",
    company: "Infosys Limited",
    detail:
      "Level 2 support for Texas Instruments. Managed upgrades, design documentation, enhancements, data migration.",
  },
  {
    period: "2011 – 2012",
    role: "Technical SME — Enovia",
    company: "NCR Corporation",
    detail:
      "Core PLM development role. Led testing, supported production releases.",
  },
  {
    period: "2010 – 2011",
    role: "Team Lead — Enovia PLM",
    company: "IBM India Pvt Ltd",
    detail:
      "Led technical team for Oil and Gas clients. Managed PLM implementations and business requirements.",
  },
  {
    period: "2007 – 2010",
    role: "Senior Software Engineer",
    company: "Teradata India Pvt Ltd",
    detail:
      "Managed Enovia-based systems. Performed enhancements and system support.",
  },
  {
    period: "2005 – 2007",
    role: "Project Engineer",
    company: "Wipro Technologies",
    detail: "Chip Manufacturing domain. Design applications and unit testing.",
  },
  {
    period: "2004 – 2005",
    role: "Software Engineer",
    company: "Birlasoft Ltd",
    detail:
      "Java/J2EE applications for General Electric. Enovia and PLM training.",
  },
];

const industries = [
  "Hi-Tech",
  "Retail (Apparel & Footwear)",
  "Data Science & Analytics",
  "Energy & Oil & Gas",
  "Chip Design & Semiconductor",
  "Product Lifecycle Management",
];

const education = [
  {
    degree: "Post Graduate Diploma in Business Administration",
    institution: "Symbiosis Institute · Pune, India",
    period: "2006 – 2008",
  },
  {
    degree: "Bachelor of Technology — Information Technology",
    institution: "UP Technical University · Lucknow, India",
    period: "2001 – 2004",
  },
  {
    degree: "Advanced Diploma in Computer Applications",
    institution: "Indian Ministry of Communications and Information Technology · Delhi",
    period: "2000 – 2001",
  },
];

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">

      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          Twenty-two years ago I wrote Java.{" "}
          <span className="gradient-text">Today I build AI agent systems.</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base font-medium" style={{ color: "var(--muted)" }}>
          Senior PM · AI Systems Builder · Lead Consultant · Nürnberg, Germany
        </p>
      </section>

      {/* Story */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">The Journey</h2>
        <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          <p>
            I started as a Software Engineer writing Java and J2EE applications fresh out of
            university. Within a year I was deep in PLM and Enovia consultancy — a niche that
            took me across some of the most complex engineering environments in the world: Texas
            Instruments, NCR Corporation, IBM, and eventually Adidas through Infosys.
          </p>
          <p>
            The pivot to Product came naturally. After nearly a decade as a PLM technical expert,
            I moved into Technical Product Owner and then Senior Product Manager roles at GfK SE in
            Nürnberg — spending six years driving legacy transformation across Retail, Hi-Tech, and
            Consumer Goods analytics at one of Germany&apos;s most respected market intelligence
            companies.
          </p>
          <p>
            In 2026 I stopped reading about AI and started building with it. The catalyst was
            simple: I had real problems — property documents, German tax filings, investment
            monitoring — eating my weekends. I decided the best way to understand AI&apos;s real
            capabilities was to apply it to problems I already knew intimately. What I built and
            what I learned is what I document here.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">22 Years · 9 Companies · 6 Industries</h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>Newest first</p>

        <div className="relative pl-6 border-l" style={{ borderColor: "var(--border)" }}>
          {timeline.map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              {/* Timeline dot */}
              <div
                className="absolute -left-[25px] w-3 h-3 rounded-full gradient-bg ring-2 ring-offset-2"
                style={{ ringOffsetColor: "var(--background)" } as React.CSSProperties}
              />
              <p className="text-xs font-bold uppercase tracking-widest mb-1 gradient-text">
                {item.period}
              </p>
              <h3 className="font-semibold text-base leading-snug">
                {item.role}
              </h3>
              <p className="text-sm mb-2" style={{ color: "var(--muted)" }}>
                {item.company}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Industries</h2>
        <div className="flex flex-wrap gap-2">
          {industries.map((ind) => (
            <span
              key={ind}
              className="text-sm px-4 py-2 rounded-full border font-medium"
              style={{
                borderColor: "var(--accent-1)",
                color: "var(--accent-1)",
                background: "rgba(14,165,233,0.06)",
              }}
            >
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Education</h2>
        <div className="flex flex-col gap-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="font-semibold text-sm mb-1">{edu.degree}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {edu.institution}
              </p>
              <p className="text-xs mt-1 gradient-text font-semibold">{edu.period}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Based in Nürnberg */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Based in Nürnberg</h2>
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Indian-born, German citizen. I have lived and worked in Germany for eleven years. I
          understand the EU regulatory context — GDPR, German tax law, Mietrecht, Betriebsrat —
          that makes AI automation genuinely different here than anywhere else in the world. This
          is not a footnote. It is the entire point of what I build.
        </p>
      </section>

      {/* LinkedIn Profile Badge */}
      <section className="mb-16">
        <LinkedInBadge locale={locale} />
      </section>

      {/* CTA */}
      <section>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-semibold mb-1">Want to work together?</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              See what I build or start a conversation.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              My Work <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full border hover:opacity-70 transition-opacity"
              style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
