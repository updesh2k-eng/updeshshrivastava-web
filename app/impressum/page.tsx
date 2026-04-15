import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und rechtliche Hinweise — Legal notice for updeshshrivastava.com",
  robots: { index: false, follow: false },
};

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        <span className="gradient-text">Impressum</span>
      </h1>
      <div className="w-16 h-1 rounded-full gradient-bg mb-10" />

      {/* ── German ──────────────────────────────────────────────────────────── */}
      <section className="mb-16 flex flex-col gap-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
            Angaben gemäß § 5 TMG
          </h2>
          <div
            className="p-5 rounded-2xl border text-sm leading-relaxed"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <p className="font-semibold mb-1">Updesh Shrivastava</p>
            <p style={{ color: "var(--muted)" }}>Am Europakanal 40</p>
            <p style={{ color: "var(--muted)" }}>91056 Erlangen</p>
            <p style={{ color: "var(--muted)" }}>Deutschland</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Kontakt</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            E-Mail:{" "}
            <a href="mailto:updesh2k@gmail.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
              updesh2k@gmail.com
            </a>
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Telefon: Auf Anfrage per E-Mail erhältlich
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Hinweis zur Rechtsform</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Diese Website wird als privates, nichtkommerzielles Portfolio betrieben.
            Eine Eintragung im Handels-, Vereins-, Partnerschafts- oder Genossenschaftsregister liegt
            nicht vor. Eine Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG liegt nicht vor,
            da keine gewerbliche Tätigkeit über diese Website ausgeübt wird.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Updesh Shrivastava (Anschrift wie oben)
          </p>
        </div>

        <Divider />

        <div>
          <h2 className="text-sm font-semibold mb-3">Haftung für Inhalte</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
            Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf dieser Website
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          </p>
        </div>

        {/* ── AI DISCLAIMER ──────────────────────────────────────────────────── */}
        <div
          className="p-5 rounded-2xl border-l-4 text-sm leading-relaxed"
          style={{ borderColor: "var(--accent-2)", background: "var(--card)" }}
        >
          <h2 className="font-semibold mb-3">
            Hinweis zu KI-generierten und KI-kuratierten Inhalten
          </h2>
          <p className="mb-3" style={{ color: "var(--muted)" }}>
            Teile dieser Website nutzen Künstliche Intelligenz (KI):
          </p>
          <ul className="flex flex-col gap-2 mb-3" style={{ color: "var(--muted)" }}>
            <li>
              <strong className="text-current">Bereich „AI News":</strong>{" "}
              Nachrichtenartikel werden automatisch über öffentliche RSS-Feeds von Drittanbietern
              bezogen. Ein KI-System (Claude AI, Anthropic) bewertet und kategorisiert diese Artikel
              nach Relevanz. Die KI erstellt keine eigenen redaktionellen Inhalte. Alle Artikel
              sind mit der jeweiligen Originalquelle verlinkt, die als alleinige inhaltliche
              Verantwortung trägt.
            </li>
            <li>
              <strong className="text-current">Allgemeiner Hinweis:</strong>{" "}
              Einzelne Artikel und Texte auf dieser Website können mit KI-Werkzeugen vorbereitet
              oder überarbeitet worden sein. Sämtliche veröffentlichten Inhalte werden vom
              Betreiber vor der Veröffentlichung geprüft.
            </li>
          </ul>
          <p style={{ color: "var(--muted)" }}>
            Obwohl alle Informationen nach bestem Wissen und Gewissen bereitgestellt werden,
            können Fehler oder Unvollständigkeiten nicht ausgeschlossen werden. Nutzer werden
            gebeten, wichtige Informationen stets an der Originalquelle zu verifizieren.
            Der Betreiber übernimmt keine Haftung für Schäden, die aus der Nutzung der auf
            dieser Website bereitgestellten Informationen entstehen.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">Haftung für Links</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen
            Einfluss habe. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Bei Bekanntwerden von
            Rechtsverletzungen werden derartige Links umgehend entfernt.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">Urheberrecht</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website
            unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung
            und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors. Downloads und Kopien dieser Seite
            sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            Inhalte Dritter sind als solche gekennzeichnet.
          </p>
        </div>

        <div className="text-xs" style={{ color: "var(--muted)" }}>
          Streitschlichtung: Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-70 transition-opacity">
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </div>
      </section>

      {/* ── English translation ──────────────────────────────────────────────── */}
      <div className="border-t pt-12" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "var(--muted)" }}>
          English Translation (informational only — German text above is legally binding)
        </p>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold mb-2">Legal Notice</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Information required under § 5 of the German Telemedia Act (TMG).
            </p>
          </div>

          <div
            className="p-5 rounded-2xl border text-sm leading-relaxed"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <p className="font-semibold mb-1">Updesh Shrivastava</p>
            <p style={{ color: "var(--muted)" }}>Am Europakanal 40, 91056 Erlangen, Germany</p>
            <p className="mt-2" style={{ color: "var(--muted)" }}>
              Email:{" "}
              <a href="mailto:updesh2k@gmail.com" className="underline underline-offset-2 hover:opacity-70">
                updesh2k@gmail.com
              </a>
            </p>
            <p style={{ color: "var(--muted)" }}>Phone: Available on request via email</p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            This website is operated as a private, non-commercial portfolio. The operator is not
            registered in any commercial register and does not hold a VAT identification number,
            as no commercial activity is conducted through this website.
          </p>

          <div
            className="p-5 rounded-2xl border-l-4 text-sm leading-relaxed"
            style={{ borderColor: "var(--accent-2)", background: "var(--card)" }}
          >
            <h3 className="font-semibold mb-2">Notice on AI-curated and AI-assisted content</h3>
            <p className="mb-2" style={{ color: "var(--muted)" }}>
              <strong>AI News section:</strong> Articles are sourced automatically from public
              RSS feeds. An AI system (Claude AI by Anthropic) scores and categorises them for
              relevance. The AI does not generate editorial content. Every article links to its
              original source, which bears sole editorial responsibility.
            </p>
            <p style={{ color: "var(--muted)" }}>
              <strong>General:</strong> Some articles on this site may have been prepared or
              revised with AI assistance. All published content is reviewed by the operator
              before publication. Users are encouraged to verify important information at the
              original source.
            </p>
          </div>

          <p className="text-sm" style={{ color: "var(--muted)" }}>
            For full privacy information, see the{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t text-xs" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        Stand / Last updated: April 2026
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full" style={{ background: "var(--border)" }} />;
}
