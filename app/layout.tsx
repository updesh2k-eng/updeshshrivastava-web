import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { getSiteConfig } from "@/lib/config";
import { LangProvider } from "@/components/LangContext";
import type { Locale } from "@/lib/i18n";
import enMessages from "@/messages/en.json";
import deMessages from "@/messages/de.json";

// Layout is intentionally dynamic — it reads the lang cookie on every request.
// Individual pages still use revalidate = 60 for their own content.
export const dynamic = "force-dynamic";

const allMessages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  de: deMessages,
};

export const metadata: Metadata = {
  title: {
    default: "Updesh Shrivastava — AI Systems Builder",
    template: "%s | Updesh Shrivastava",
  },
  description:
    "Senior PM and AI Systems Builder based in Nürnberg, Germany. Building hybrid AI agent systems for EU regulatory workflows.",
  keywords: ["Updesh Shrivastava", "AI Systems Builder", "Senior PM", "Nürnberg", "GDPR", "AI agents"],
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Updesh Shrivastava — Writing" }],
    },
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: "/logo-icon.png",
    shortcut: "/logo-icon.png",
  },
  openGraph: {
    title: "Updesh Shrivastava — AI Systems Builder",
    description:
      "Senior PM and AI Systems Builder based in Nürnberg, Germany. Building hybrid AI agent systems for EU regulatory workflows.",
    url: "https://updeshshrivastava.com",
    siteName: "Updesh Shrivastava",
    images: [{ url: "/logo.png", width: 800, height: 800, alt: "Updesh Shrivastava" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Updesh Shrivastava — AI Systems Builder",
    description:
      "Senior PM and AI Systems Builder based in Nürnberg, Germany.",
    images: ["/logo-icon.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [config, cookieStore] = await Promise.all([
    getSiteConfig(),
    cookies(),
  ]);
  const lang: Locale = cookieStore.get("lang")?.value === "de" ? "de" : "en";
  const messages = allMessages[lang];

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LangProvider lang={lang} messages={messages}>
            <SiteChrome navLinks={config.nav}>{children}</SiteChrome>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
