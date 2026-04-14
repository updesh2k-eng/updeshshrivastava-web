import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, TwitterXIcon, LinkedinIcon } from "@/components/SocialIcons";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Updesh Shrivastava.",
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@updeshshrivastava.com",
    href: "mailto:hello@updeshshrivastava.com",
    description: "Best for project inquiries and collaborations",
  },
  {
    icon: TwitterXIcon,
    label: "Twitter / X",
    value: "@updeshshrivastava",
    href: "https://twitter.com/updeshshrivastava",
    description: "Quick thoughts, DMs open",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "updesh2k-eng",
    href: "https://github.com/updesh2k-eng",
    description: "Open-source projects and code",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "Updesh Shrivastava",
    href: "https://linkedin.com/in/updeshshrivastava",
    description: "Professional networking",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>
          Whether you have a project in mind, want to collaborate, or just want to say hi —
          I&apos;m always happy to hear from you. I typically respond within 24–48 hours.
        </p>
      </section>

      {/* Contact form */}
      <section className="mb-16">
        <h2 className="text-lg font-bold mb-6">Send me a message</h2>
        <ContactForm />
      </section>

      {/* Contact channels */}
      <section className="mb-16">
        <h2 className="text-lg font-bold mb-5">Or reach me directly</h2>
        <div className="grid gap-3">
          {channels.map(({ icon: Icon, label, value, href, description }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="group flex items-center gap-5 p-5 rounded-2xl border transition-all duration-200 hover:border-violet-500/50"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-all duration-200 group-hover:gradient-bg group-hover:text-white"
                style={{ background: "var(--border)", color: "var(--muted)" }}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{label}</span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--muted)" }}
                  />
                </div>
                <p className="text-sm gradient-text font-medium truncate">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Availability note */}
      <section>
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold">Available for work</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            I&apos;m currently open to senior engineering roles, interesting consulting
            projects, and technical writing opportunities. If you think we&apos;d be a good
            fit, don&apos;t hesitate to reach out.
          </p>
        </div>
      </section>
    </div>
  );
}
