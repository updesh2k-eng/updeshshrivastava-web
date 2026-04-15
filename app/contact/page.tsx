import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { ContactForm } from "@/components/ContactForm";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Updesh Shrivastava — Senior PM, AI Systems Builder, Lead Consultant based in Nürnberg, Germany.",
};

const content = {
  en: {
    titleStart: "Let's",
    titleGradient: "talk",
    subtitle: "I am selective about what I take on. If what you are trying to do fits what I build — I am interested in the conversation.",
    availableFor: "Available for",
    currentlyTitle: "Currently",
    currentlyBody: "Full-time Lead Consultant at Infosys — not available for paid work. Open to social good and non-profit conversations on weekends. Based in Nürnberg — remote across EU.",
    sendMessage: "Send me a message",
    reachDirectly: "Reach me directly",
    available: [
      { title: "Social good & non-profit AI projects", detail: "Helping charities, community organisations, and social enterprises understand and apply AI. Weekends only, no charge." },
      { title: "Pro bono AI literacy", detail: "Workshops, advice, or hands-on help for non-profits starting their AI journey in Germany and the EU — GDPR-aware from day one." },
      { title: "Writing and open knowledge-sharing", detail: "Documenting what I build publicly. If something I write is useful to your organisation, get in touch." },
    ],
  },
  de: {
    titleStart: "Lass uns",
    titleGradient: "reden",
    subtitle: "Ich bin wählerisch bei dem, was ich übernehme. Wenn das, was Sie versuchen zu tun, zu dem passt, was ich baue — bin ich an einem Gespräch interessiert.",
    availableFor: "Verfügbar für",
    currentlyTitle: "Aktuell",
    currentlyBody: "Vollzeit Lead Consultant bei Infosys — nicht für bezahlte Arbeit verfügbar. Offen für Gespräche über soziale Projekte und Non-Profits an Wochenenden. Ansässig in Nürnberg — remote in der EU.",
    sendMessage: "Nachricht senden",
    reachDirectly: "Direkt kontaktieren",
    available: [
      { title: "Soziale Projekte & Non-Profit-KI", detail: "Hilfe für Wohltätigkeitsorganisationen, Gemeindeorganisationen und Sozialunternehmen beim Verstehen und Anwenden von KI. Nur Wochenenden, kostenlos." },
      { title: "Pro-bono KI-Kompetenz", detail: "Workshops, Beratung oder praktische Hilfe für Non-Profits, die ihre KI-Reise in Deutschland und der EU beginnen — von Anfang an DSGVO-bewusst." },
      { title: "Schreiben und offenes Wissensaustausch", detail: "Ich dokumentiere öffentlich, was ich baue. Wenn etwas, das ich schreibe, für Ihre Organisation nützlich ist, melden Sie sich." },
    ],
  },
};

export default async function ContactPage() {
  const locale = await getLocale();
  const c = content[locale];

  const contactLinks = [
    { Icon: Mail,        label: "Email",    value: "updesh2k@gmail.com",                          href: "mailto:updesh2k@gmail.com" },
    { Icon: LinkedinIcon, label: "LinkedIn", value: "linkedin.com/in/updesh-shrivastava-70123814", href: "https://www.linkedin.com/in/updesh-shrivastava-70123814/" },
    { Icon: GithubIcon,  label: "GitHub",   value: "github.com/updesh2k-eng",                    href: "https://github.com/updesh2k-eng" },
    { Icon: MapPin,      label: locale === "de" ? "Standort" : "Location", value: "Nürnberg, Greater Metropolitan Area, Bavaria, Germany", href: null },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <section className="mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {c.titleStart}&nbsp;<span className="gradient-text">{c.titleGradient}</span>
        </h1>
        <div className="w-16 h-1 rounded-full gradient-bg mb-6" />
        <p className="text-base leading-relaxed" style={{ color: "var(--muted)" }}>{c.subtitle}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-5">{c.availableFor}</h2>
        <div className="flex flex-col gap-3">
          {c.available.map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="mt-0.5 shrink-0 w-2 h-2 rounded-full gradient-bg" style={{ marginTop: "6px" }} />
              <div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-start gap-3 p-5 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" style={{ marginTop: "6px" }} />
          <div>
            <p className="font-semibold text-sm mb-1">{c.currentlyTitle}</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{c.currentlyBody}</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-5">{c.sendMessage}</h2>
        <ContactForm />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-5">{c.reachDirectly}</h2>
        <div className="flex flex-col gap-3">
          {contactLinks.map(({ Icon, label, value, href }) => {
            const inner = (
              <div className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <div className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                  style={{ background: "var(--border)", color: "var(--muted)" }}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--muted)" }}>{label}</p>
                  <p className="text-sm font-medium truncate gradient-text">{value}</p>
                </div>
                {href && <ArrowUpRight size={14} style={{ color: "var(--muted)" }} className="shrink-0" />}
              </div>
            );
            return href ? (
              <Link key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group hover:opacity-80 transition-opacity">
                {inner}
              </Link>
            ) : (
              <div key={label}>{inner}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
