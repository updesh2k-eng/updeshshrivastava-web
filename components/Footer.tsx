import Link from "next/link";
import { GithubIcon, TwitterXIcon, LinkedinIcon } from "./SocialIcons";

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
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} Updesh Shrivastava. Built with Next.js &amp; Tailwind CSS.
        </p>
        <div className="flex items-center gap-4">
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
    </footer>
  );
}
