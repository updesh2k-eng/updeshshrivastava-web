import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { GithubIcon, TwitterXIcon, LinkedinIcon } from "@/components/SocialIcons";

const featuredWork = [
  {
    title: "AI-Powered Analytics Dashboard",
    description:
      "A real-time analytics platform serving 50K+ daily active users, built with Next.js, TypeScript, and a custom data pipeline.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "AI/ML"],
    href: "/work/analytics-dashboard",
  },
  {
    title: "Open-Source Design System",
    description:
      "A fully accessible component library with 60+ components, dark mode support, and auto-generated documentation.",
    tags: ["React", "Tailwind CSS", "Storybook", "a11y"],
    href: "/work/design-system",
  },
  {
    title: "Developer Productivity CLI",
    description:
      "A command-line tool that automates repetitive dev tasks, saving teams an average of 3 hours per week.",
    tags: ["Node.js", "TypeScript", "CLI", "Open Source"],
    href: "/work/dev-cli",
  },
];

const featuredPosts = [
  {
    title: "The Hidden Cost of Premature Abstraction",
    date: "March 28, 2025",
    readTime: "7 min read",
    href: "/writing/premature-abstraction",
  },
  {
    title: "Building for Scale: Lessons from 10M Requests/Day",
    date: "February 14, 2025",
    readTime: "12 min read",
    href: "/writing/building-for-scale",
  },
  {
    title: "Why I Rewrote My Side Project in Rust",
    date: "January 5, 2025",
    readTime: "9 min read",
    href: "/writing/rust-rewrite",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center">
        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-8 w-fit"
          style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--card)" }}
        >
          <Sparkles size={12} className="text-violet-400" />
          Open to new opportunities
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
          Hi, I&apos;m{" "}
          <span className="gradient-text">Updesh</span>
          <br />
          <span style={{ color: "var(--muted)" }} className="font-light">
            I build things for the web.
          </span>
        </h1>

        <p className="text-lg max-w-2xl leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
          Software engineer passionate about crafting performant, accessible, and beautiful
          digital experiences. I write about engineering, design systems, and the craft of
          building software that lasts.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm gradient-bg text-white transition-opacity hover:opacity-90"
          >
            View my work <ArrowRight size={16} />
          </Link>
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            Read my writing
          </Link>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-5 mt-12">
          {[
            { href: "https://github.com/updesh2k-eng", Icon: GithubIcon, label: "GitHub" },
            { href: "https://twitter.com/updeshshrivastava", Icon: TwitterXIcon, label: "Twitter" },
            { href: "https://linkedin.com/in/updeshshrivastava", Icon: LinkedinIcon, label: "LinkedIn" },
          ].map(({ href, Icon, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Work */}
      <section className="mt-32">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Selected Work</h2>
          <Link
            href="/work"
            className="text-sm flex items-center gap-1 hover:opacity-60 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            All projects <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4">
          {featuredWork.map((project, i) => (
            <Link
              key={i}
              href={project.href}
              className="group block p-6 rounded-2xl border transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:gradient-text transition-all">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {project.description}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                  style={{ color: "var(--muted)" }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
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
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Writing */}
      <section className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Recent Writing</h2>
          <Link
            href="/writing"
            className="text-sm flex items-center gap-1 hover:opacity-60 transition-opacity"
            style={{ color: "var(--muted)" }}
          >
            All posts <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "var(--border)" }}>
          {featuredPosts.map((post, i) => (
            <Link
              key={i}
              href={post.href}
              className="group flex items-center justify-between py-5 transition-opacity hover:opacity-70"
            >
              <div>
                <h3 className="font-medium mb-1">{post.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {post.date} · {post.readTime}
                </p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                style={{ color: "var(--muted)" }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <div
          className="relative overflow-hidden rounded-3xl p-10 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)",
            }}
          />
          <h2 className="relative text-2xl font-bold mb-3">Let&apos;s work together</h2>
          <p className="relative text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--muted)" }}>
            Have an interesting project or just want to chat? I&apos;m always open to new
            conversations.
          </p>
          <Link
            href="/contact"
            className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm gradient-bg text-white transition-opacity hover:opacity-90"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
