import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Updesh Shrivastava — software engineer, builder, and writer.",
};

const skills = [
  { category: "Languages", items: ["TypeScript", "Python", "Rust", "Go", "SQL"] },
  { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "Kafka"] },
  { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
];

const timeline = [
  {
    year: "2024 — Present",
    role: "Senior Software Engineer",
    company: "TechCorp Inc.",
    description:
      "Leading frontend architecture for a B2B SaaS platform with 100K+ users. Built a design system from scratch and drove a 40% improvement in page load performance.",
  },
  {
    year: "2022 — 2024",
    role: "Software Engineer",
    company: "StartupXYZ",
    description:
      "Early engineer at a Series A startup. Owned the full stack — from React dashboards to Node.js APIs and Postgres schemas. Helped scale from 0 to 20K users.",
  },
  {
    year: "2020 — 2022",
    role: "Frontend Developer",
    company: "Digital Agency Co.",
    description:
      "Built web experiences for clients across fintech, e-commerce, and healthcare. Delivered 15+ projects on tight deadlines.",
  },
  {
    year: "2016 — 2020",
    role: "B.Tech in Computer Science",
    company: "National Institute of Technology",
    description:
      "Graduated with distinction. Active in the coding club; won two national-level hackathons.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          About <span className="gradient-text">Me</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-8" />
        <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          <p>
            Hey, I&apos;m Updesh — a software engineer based in India with a deep passion for
            building elegant, performant software that solves real problems. I&apos;ve spent the
            last 6+ years working across the stack, from pixel-perfect UIs to distributed
            backend systems.
          </p>
          <p>
            When I&apos;m not coding, you&apos;ll find me writing about engineering, contributing to
            open-source projects, or going down rabbit holes learning new programming languages.
            I believe the best software is built at the intersection of strong engineering
            fundamentals and genuine curiosity.
          </p>
          <p>
            I care deeply about developer experience, clean abstractions, and the art of writing
            code that&apos;s easy to read six months later. If that resonates with you, we should
            talk.
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Skills &amp; Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {skills.map(({ category, items }) => (
            <div
              key={category}
              className="p-5 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--muted)" }}>
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="text-sm px-3 py-1 rounded-full border"
                    style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Experience</h2>
        <div className="relative pl-6 border-l" style={{ borderColor: "var(--border)" }}>
          {timeline.map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              {/* Dot */}
              <div
                className="absolute -left-[25px] w-3 h-3 rounded-full gradient-bg ring-2 ring-offset-2"
              />
              <p className="text-xs font-semibold uppercase tracking-widest mb-1 gradient-text">
                {item.year}
              </p>
              <h3 className="font-semibold text-base">
                {item.role}{" "}
                <span style={{ color: "var(--muted)" }}>@ {item.company}</span>
              </h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div>
            <h3 className="font-semibold mb-1">Want to know more?</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Check out my work or get in touch.
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
