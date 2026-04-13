import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Updesh Shrivastava — Senior PM, AI Systems Builder, Lead Consultant based in Nürnberg, Germany.",
};

const available = [
  {
    title: "Social good & non-profit AI projects",
    detail:
      "Helping charities, community organisations, and social enterprises understand and apply AI. Weekends only, no charge.",
  },
  {
    title: "Pro bono AI literacy",
    detail:
      "Workshops, advice, or hands-on help for non-profits starting their AI journey in Germany and the EU — GDPR-aware from day one.",
  },
  {
    title: "Writing and open knowledge-sharing",
    detail:
      "Documenting what I build publicly. If something I write is useful to your organisation, get in touch.",
  },
];

const contactLinks = [
  {
    Icon: Mail,
    label: "Email",
    value: "updesh2k@gmail.com",
    href: "mailto:updesh2k@gmail.com",
  },
  {
    Icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/updesh-shrivastava",
    href: "https://linkedin.com/in/updesh-shrivastava",
  },
  {
    Icon: GithubIcon,
    label: "GitHub",
    value: "github.com/updesh2k-eng",
    href: "https://github.com/updesh2k-eng",
  },
  {
    Icon: MapPin,
    label: "Location",
    value: "Nürnberg, Greater Metropolitan Area, Bavaria, Germany",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Let&apos;s <span className="gradient-text">talk</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          I am selective about what I take on. If what you are trying to do fits what I build
          — I am interested in the conversation.
        </p>
      </section>

      {/* Available for */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-5">Available for</h2>
        <div className="flex flex-col gap-3">
          {available.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-5 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="mt-0.5 shrink-0 w-2 h-2 rounded-full gradient-bg"
                style={{ marginTop: "6px" }}
              />
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Currently */}
      <section className="mb-12">
        <div
          className="flex items-start gap-3 p-5 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" style={{ marginTop: "6px" }} />
          <div>
            <p className="font-semibold text-sm mb-1">Currently</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Full-time Lead Consultant at Infosys — not available for paid work.
              Open to social good and non-profit conversations on weekends.
              Based in Nürnberg — remote across EU.
            </p>
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-5">Reach me</h2>
        <div className="flex flex-col gap-3">
          {contactLinks.map(({ Icon, label, value, href }) => {
            const inner = (
              <div
                className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                  style={{ background: "var(--border)", color: "var(--muted)" }}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>
                    {label}
                  </p>
                  <p className="text-sm font-medium truncate gradient-text">{value}</p>
                </div>
                {href && <ArrowUpRight size={14} style={{ color: "var(--muted)" }} className="shrink-0" />}
              </div>
            );

            return href ? (
              <Link
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group hover:opacity-80 transition-opacity"
              >
                {inner}
              </Link>
            ) : (
              <div key={label}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* Note */}
      <section>
        <p className="text-sm text-center italic" style={{ color: "var(--muted)" }}>
          No rates listed here — intentionally. Every engagement is different. Start with a
          conversation.
        </p>
      </section>
    </div>
  );
}
