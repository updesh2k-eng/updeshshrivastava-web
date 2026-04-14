import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { GithubIcon, TwitterXIcon, LinkedinIcon } from "@/components/SocialIcons";
import { getSiteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const { home } = getSiteConfig();
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border mb-8 w-fit"
          style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--card)" }}
        >
          <MapPin size={12} className="text-violet-400" />
          {home.badge}
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4">
          <span className="gradient-text">Updesh Shrivastava</span>
        </h1>

        <p className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>
          {home.headline}
        </p>

        <p className="text-base font-medium mb-10" style={{ color: "var(--muted)" }}>
          {home.subheadline}
        </p>

        <ul className="flex flex-col gap-3 mb-10">
          {home.proofPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--muted)" }}>
              <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full gradient-bg" />
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={home.ctaPrimary.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm gradient-bg text-white transition-opacity hover:opacity-90"
          >
            {home.ctaPrimary.label} <ArrowRight size={16} />
          </Link>
          <Link
            href={home.ctaSecondary.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            {home.ctaSecondary.label}
          </Link>
        </div>

        <div className="flex items-center gap-5 mt-12">
          {[
            { href: home.social.github, Icon: GithubIcon, label: "GitHub" },
            { href: home.social.twitter, Icon: TwitterXIcon, label: "Twitter" },
            { href: home.social.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
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
          <Link href="/work" className="text-sm flex items-center gap-1 hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            All projects <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4">
          {home.featuredWork.map((project, i) => (
            <Link
              key={i}
              href={project.href}
              className="group block p-6 rounded-2xl border transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 group-hover:gradient-text transition-all">{project.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{project.description}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" style={{ color: "var(--muted)" }} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Writing — pulled from actual posts */}
      <section className="mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Recent Writing</h2>
          <Link href="/writing" className="text-sm flex items-center gap-1 hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>
            All posts <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "var(--border)" }}>
          {recentPosts.map((post, i) => (
            <Link key={i} href={`/writing/${post.slug}`} className="group flex items-center justify-between py-5 transition-opacity hover:opacity-70">
              <div>
                <h3 className="font-medium mb-1">{post.title}</h3>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.readTime}
                </p>
              </div>
              <ArrowRight size={16} className="shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" style={{ color: "var(--muted)" }} />
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24">
        <div className="relative overflow-hidden rounded-3xl p-10 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, #8b5cf6 0%, transparent 70%)" }} />
          <h2 className="relative text-2xl font-bold mb-3">{home.ctaSection.title}</h2>
          <p className="relative text-sm mb-6 max-w-md mx-auto" style={{ color: "var(--muted)" }}>{home.ctaSection.description}</p>
          <Link href={home.ctaSection.buttonHref} className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm gradient-bg text-white transition-opacity hover:opacity-90">
            {home.ctaSection.buttonLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
