import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies and projects by Updesh Shrivastava.",
};

const projects = [
  {
    id: "analytics-dashboard",
    title: "AI-Powered Analytics Dashboard",
    tagline: "Real-time insights at scale",
    description:
      "Designed and built a real-time analytics platform serving 50,000+ daily active users. Integrated an AI layer for anomaly detection and trend forecasting, reducing time-to-insight by 60%.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "AI/ML", "Redis"],
    year: "2024",
    highlights: [
      "50K+ daily active users",
      "60% faster time-to-insight",
      "99.9% uptime SLA",
    ],
    href: "/work/analytics-dashboard",
  },
  {
    id: "design-system",
    title: "Open-Source Design System",
    tagline: "60+ components, zero compromise on accessibility",
    description:
      "Created a fully accessible, theme-aware component library used by 3 internal teams and 200+ GitHub stars. Includes auto-generated Storybook docs and design token exports.",
    tags: ["React", "Tailwind CSS", "Storybook", "Radix UI", "a11y"],
    year: "2023",
    highlights: [
      "60+ production-ready components",
      "WCAG 2.1 AA compliant",
      "200+ GitHub stars",
    ],
    href: "/work/design-system",
  },
  {
    id: "dev-cli",
    title: "Developer Productivity CLI",
    tagline: "Automate the boring parts",
    description:
      "Open-source CLI tool that streamlines repetitive developer workflows — scaffolding, code generation, git automation, and environment management. 3 hours saved per developer per week.",
    tags: ["Node.js", "TypeScript", "CLI", "Open Source", "Shell"],
    year: "2023",
    highlights: [
      "3 hrs/week saved per dev",
      "1,000+ installs on npm",
      "15+ automated workflows",
    ],
    href: "/work/dev-cli",
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform Overhaul",
    tagline: "Performance-first redesign",
    description:
      "Led the frontend migration of a legacy e-commerce platform to Next.js App Router. Improved Core Web Vitals scores by 45% and conversion rate by 12% through performance optimizations.",
    tags: ["Next.js", "React", "Tailwind CSS", "Shopify", "Performance"],
    year: "2022",
    highlights: [
      "45% better Core Web Vitals",
      "12% conversion increase",
      "Legacy → App Router migration",
    ],
    href: "/work/ecommerce-platform",
  },
  {
    id: "fintech-api",
    title: "Fintech Payment Microservice",
    tagline: "High-throughput, fault-tolerant payments",
    description:
      "Architected a payment processing microservice handling $2M+ daily transaction volume. Built with event sourcing, idempotency guarantees, and full audit trail.",
    tags: ["Node.js", "Kafka", "PostgreSQL", "AWS", "Microservices"],
    year: "2022",
    highlights: [
      "$2M+ daily transactions",
      "Zero downtime deploys",
      "Full audit trail",
    ],
    href: "/work/fintech-api",
  },
];

export default function WorkPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Selected <span className="gradient-text">Work</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base max-w-xl leading-relaxed" style={{ color: "var(--muted)" }}>
          A curated collection of projects I&apos;ve built or contributed to. Each represents
          a meaningful engineering challenge and a story worth telling.
        </p>
      </section>

      {/* Projects grid */}
      <div className="grid gap-6">
        {projects.map((project) => (
          <article
            key={project.id}
            className="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:border-violet-500/50"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="p-7">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest gradient-text">
                    {project.year}
                  </span>
                  <h2 className="text-xl font-bold mt-1">{project.title}</h2>
                  <p className="text-sm font-medium mt-0.5" style={{ color: "var(--muted)" }}>
                    {project.tagline}
                  </p>
                </div>
                <Link
                  href={project.href}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border opacity-0 group-hover:opacity-100 transition-all duration-200 hover:gradient-bg hover:border-transparent hover:text-white"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  aria-label={`View ${project.title}`}
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
                {project.description}
              </p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-3 mb-5">
                {project.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      color: "var(--accent-2)",
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full border"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
