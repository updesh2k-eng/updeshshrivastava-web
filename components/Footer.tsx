import Link from "next/link";
import { GithubIcon, TwitterXIcon, LinkedinIcon } from "./SocialIcons";
import { SubscribeForm } from "./SubscribeForm";

const socialLinks = [
  { href: "https://github.com/updesh2k-eng", Icon: GithubIcon, label: "GitHub" },
  { href: "https://twitter.com/updeshshrivastava", Icon: TwitterXIcon, label: "Twitter" },
  { href: "https://linkedin.com/in/updeshshrivastava", Icon: LinkedinIcon, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Subscribe row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
          <SubscribeForm />
          <div className="flex items-center gap-4 shrink-0">
            {socialLinks.map(({ href, Icon, label }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-opacity duration-200 hover:opacity-60"
                style={{ color: "var(--muted)" }}
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>
        {/* Copyright + Legal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} Updesh Shrivastava. Built with Next.js &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/impressum" className="hover:opacity-70 transition-opacity underline underline-offset-2">
              Impressum
            </Link>
            <Link href="/privacy" className="hover:opacity-70 transition-opacity underline underline-offset-2">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
