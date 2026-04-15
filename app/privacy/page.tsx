import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and GDPR information for updeshshrivastava.com",
  robots: { index: false, follow: false },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold mb-3 mt-8">{children}</h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold mb-2 mt-5">{children}</h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--muted)" }}>
      {children}
    </p>
  );
}

function RightItem({ title, article, children }: { title: string; article: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-mono shrink-0 mt-0.5 px-1.5 py-0.5 rounded border self-start"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        {article}
      </span>
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        <strong className="text-foreground">{title}:</strong> {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        <span className="gradient-text">Privacy Policy</span>
      </h1>
      <div className="w-16 h-1 rounded-full gradient-bg mb-3" />
      <p className="text-xs mb-10" style={{ color: "var(--muted)" }}>
        Last updated: April 2026 ·{" "}
        <Link href="/impressum" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
          Impressum
        </Link>
      </p>

      {/* 1. Controller */}
      <H2>1. Controller (Data Responsible Person)</H2>
      <P>
        The controller responsible for data processing on this website within the meaning of the
        EU General Data Protection Regulation (GDPR) is:
      </P>
      <div
        className="p-5 rounded-2xl border text-sm leading-relaxed mb-4"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <p className="font-semibold mb-0.5">Updesh Shrivastava</p>
        <p style={{ color: "var(--muted)" }}>Am Europakanal 40, 91056 Erlangen, Germany</p>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Email:{" "}
          <a href="mailto:updesh2k@gmail.com"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity">
            updesh2k@gmail.com
          </a>
        </p>
      </div>
      <P>
        This website is operated as a private, non-commercial portfolio by a private individual.
        No Data Protection Officer (DPO) is required or appointed, as none is mandated under
        GDPR Art. 37 for private individuals not conducting large-scale processing.
      </P>

      {/* 2. Data we collect */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>2. What Data We Collect and Why</H2>

      <H3>2.1 Hosting and Access Logs</H3>
      <P>
        This website is hosted by Vercel (Frankfurt, Germany — EU region{" "}
        <code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--card)" }}>
          eu-central-1 / fra1
        </code>
        ). When you visit the site, Vercel automatically records standard server log data:
        your IP address, browser type, operating system, requested URL, HTTP status code,
        and timestamp.
      </P>
      <P>
        This processing is technically unavoidable for serving a website.
        The operator does not create or store server log files separately. Data is held
        by Vercel per their standard retention policy (typically up to 30 days).
      </P>
      <div className="text-xs p-3 rounded-xl mb-4" style={{ background: "var(--card)", color: "var(--muted)" }}>
        <strong>Legal basis:</strong> GDPR Art. 6(1)(f) — legitimate interest in operating a
        technically secure, functional website.
      </div>

      <H3>2.2 Contact Form</H3>
      <P>
        When you submit the contact form at{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
          /contact
        </Link>
        , the following is collected and stored in a Supabase database located in{" "}
        <strong>Paris, France (EU West region)</strong>:
      </P>
      <ul className="text-sm mb-4 flex flex-col gap-1" style={{ color: "var(--muted)" }}>
        <li className="flex gap-2"><span>→</span> Your name</li>
        <li className="flex gap-2"><span>→</span> Your email address</li>
        <li className="flex gap-2"><span>→</span> Your message</li>
      </ul>
      <P>
        This data is used solely to respond to your enquiry and is not shared with third parties.
      </P>
      <div className="text-xs p-3 rounded-xl mb-4" style={{ background: "var(--card)", color: "var(--muted)" }}>
        <strong>Legal basis:</strong> GDPR Art. 6(1)(b) — necessary to respond to your request
        (pre-contractual measures); alternatively Art. 6(1)(f) — legitimate interest in
        maintaining communication.{" "}
        <strong>Retention:</strong> Contact messages are retained until the enquiry is fully
        resolved, then deleted within 6 months, unless legal obligations require longer retention.
      </div>

      <H3>2.3 Newsletter Subscription</H3>
      <P>
        When you enter your email in the subscription form in the page footer, your email address
        is stored in a Supabase database in <strong>Paris, France (EU West region)</strong>.
      </P>
      <P>
        Your email is collected to send you occasional updates about new articles and projects
        on this site. No emails are currently being sent actively; your address is stored for
        use when a newsletter is launched.
      </P>
      <div className="text-xs p-3 rounded-xl mb-4" style={{ background: "var(--card)", color: "var(--muted)" }}>
        <strong>Legal basis:</strong> GDPR Art. 6(1)(a) — your explicit consent given via
        the subscription form.{" "}
        <strong>Withdrawal of consent:</strong> You may unsubscribe at any time by emailing{" "}
        <a href="mailto:updesh2k@gmail.com?subject=Unsubscribe"
          className="underline underline-offset-2 hover:opacity-70">
          updesh2k@gmail.com
        </a>{" "}
        with the subject "Unsubscribe". Withdrawal does not affect the lawfulness of any
        processing prior to withdrawal.
      </div>

      <H3>2.4 Admin Authentication</H3>
      <P>
        The admin panel (<code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--card)" }}>/admin</code>)
        uses Supabase Authentication for the website operator's own login. A session token
        is stored in the operator's browser only during an active admin session.
        This section does not affect or collect data from public website visitors.
      </P>

      <H3>2.5 Article View Counts</H3>
      <P>
        Blog posts maintain an anonymous integer view counter. Only the count is incremented —
        no visitor identity, IP address, or personal data is associated with a view.
      </P>

      {/* 3. Processors */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>3. Data Processors</H2>
      <P>
        We use the following GDPR-compliant processors. All data processing takes place
        within the European Union — no personal data is transferred to third countries.
      </P>

      <div className="rounded-2xl border overflow-hidden mb-4" style={{ borderColor: "var(--border)" }}>
        <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-wider px-4 py-2.5 border-b"
          style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted)" }}>
          <span>Processor</span>
          <span>Data centre</span>
          <span>Purpose</span>
        </div>
        {[
          {
            name: "Vercel Inc.",
            region: "Frankfurt, Germany (eu-central-1)",
            purpose: "Website hosting, CDN, page serving",
            url: "https://vercel.com/legal/privacy-policy",
          },
          {
            name: "Supabase Inc.",
            region: "Paris, France (eu-west-3)",
            purpose: "Contact messages, newsletter emails, blog posts",
            url: "https://supabase.com/privacy",
          },
        ].map((p) => (
          <div key={p.name} className="grid grid-cols-3 text-sm px-4 py-3 border-b last:border-0"
            style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-70 transition-opacity font-medium">
              {p.name}
            </a>
            <span>{p.region}</span>
            <span>{p.purpose}</span>
          </div>
        ))}
      </div>
      <P>
        Data Processing Agreements (DPAs) are in place with both processors. Since both
        providers operate the relevant infrastructure inside the EU, no Standard Contractual
        Clauses (SCCs) for third-country transfers are required for the data processing
        activities described in this policy.
      </P>

      {/* 4. Cookies */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>4. Cookies</H2>
      <P>
        This website does <strong>not</strong> use tracking cookies, analytics cookies, or
        advertising cookies. No cookie consent banner is displayed because no non-essential
        cookies are set for public visitors.
      </P>
      <P>
        The admin panel sets a strictly necessary session cookie during the operator's
        authenticated session only. This cookie is automatically deleted when the session
        ends or the operator logs out.
      </P>

      {/* 5. AI Content */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>5. AI-Curated Content (AI News Section)</H2>
      <div
        className="p-5 rounded-2xl border-l-4 text-sm leading-relaxed mb-4"
        style={{ borderColor: "var(--accent-2)", background: "var(--card)" }}
      >
        <p className="mb-3" style={{ color: "var(--muted)" }}>
          The <Link href="/ai-news" className="underline underline-offset-2 hover:opacity-70">/ai-news</Link>{" "}
          section aggregates articles from public RSS feeds published by third-party media
          (TechCrunch, The Verge, VentureBeat, MIT Tech Review, Wired, OpenAI, DeepMind,
          Hacker News, arXiv). A scheduled server-side job uses Claude AI (Anthropic) to score
          and categorise articles for relevance.
        </p>
        <ul className="flex flex-col gap-1.5" style={{ color: "var(--muted)" }}>
          <li className="flex gap-2 text-sm"><span className="shrink-0">→</span>
            <strong>No personal data</strong> from website visitors is used in or sent to the AI system
          </li>
          <li className="flex gap-2 text-sm"><span className="shrink-0">→</span>
            The AI processes only article titles and text excerpts from third-party RSS feeds
          </li>
          <li className="flex gap-2 text-sm"><span className="shrink-0">→</span>
            The AI does not generate editorial content — it only scores and categorises existing articles
          </li>
          <li className="flex gap-2 text-sm"><span className="shrink-0">→</span>
            Every article links directly to its original publisher, who bears editorial responsibility
          </li>
          <li className="flex gap-2 text-sm"><span className="shrink-0">→</span>
            Anthropic does not receive personal data from this website's visitors as part of this integration
          </li>
        </ul>
      </div>
      <P>
        Some articles and written content on this site may have been prepared or revised with
        AI assistance. All published content is reviewed by the operator before publication.
        Users are encouraged to verify important information at the original source.
        The operator accepts no liability for errors or omissions in AI-curated or AI-assisted content.
      </P>

      {/* 6. No Analytics */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>6. Analytics and Tracking</H2>
      <P>
        This website does not use Google Analytics, Meta Pixel, or any other third-party
        analytics or tracking service. No data is collected for advertising, profiling,
        or behavioural analytics purposes.
      </P>

      {/* 7. Your rights */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>7. Your Rights Under the GDPR</H2>
      <P>
        If we process personal data about you, you have the following rights.
        To exercise any of them, email{" "}
        <a href="mailto:updesh2k@gmail.com"
          className="underline underline-offset-2 hover:opacity-70 transition-opacity">
          updesh2k@gmail.com
        </a>
        . We will respond within one month (GDPR Art. 12).
      </P>
      <div className="flex flex-col gap-3 mb-4">
        <RightItem title="Right of access" article="Art. 15">
          You can request a copy of the personal data we hold about you.
        </RightItem>
        <RightItem title="Right to rectification" article="Art. 16">
          You can ask us to correct inaccurate data or complete incomplete data.
        </RightItem>
        <RightItem title="Right to erasure" article="Art. 17">
          You can ask us to delete your personal data ("right to be forgotten"), subject
          to legal retention obligations.
        </RightItem>
        <RightItem title="Right to restriction" article="Art. 18">
          You can ask us to restrict processing in certain circumstances.
        </RightItem>
        <RightItem title="Right to data portability" article="Art. 20">
          You can request your data in a structured, machine-readable format.
        </RightItem>
        <RightItem title="Right to object" article="Art. 21">
          You can object to processing based on legitimate interests (Art. 6(1)(f)).
        </RightItem>
        <RightItem title="Right to withdraw consent" article="Art. 7(3)">
          Where processing is based on consent (newsletter), you may withdraw it at any time
          without affecting the lawfulness of prior processing.
        </RightItem>
      </div>

      {/* 8. Supervisory authority */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>8. Right to Lodge a Complaint</H2>
      <P>
        You have the right to lodge a complaint with the competent data protection supervisory
        authority. For Bavaria, this is:
      </P>
      <div
        className="p-5 rounded-2xl border text-sm leading-relaxed"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <p className="font-semibold mb-1">Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</p>
        <p style={{ color: "var(--muted)" }}>Promenade 27, 91522 Ansbach, Germany</p>
        <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer"
          className="text-sm underline underline-offset-2 hover:opacity-70 transition-opacity mt-1 block"
          style={{ color: "var(--muted)" }}>
          www.lda.bayern.de
        </a>
      </div>

      {/* 9. Changes */}
      <div className="h-px w-full my-8" style={{ background: "var(--border)" }} />
      <H2>9. Changes to This Policy</H2>
      <P>
        This privacy policy may be updated to reflect changes in data processing practices or
        legal requirements. The date at the top of this page shows when it was last revised.
        Continued use of this website after changes constitutes acceptance of the updated policy.
      </P>

      <div className="mt-10 pt-8 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        <Link href="/impressum" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
          Impressum
        </Link>
        {" · "}
        Last updated: April 2026
      </div>
    </div>
  );
}
