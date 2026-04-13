import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Updesh Shrivastava — AI Systems Builder",
    template: "%s | Updesh Shrivastava",
  },
  description:
    "Senior PM and AI Systems Builder based in Nürnberg, Germany. Building hybrid AI agent systems for EU regulatory workflows.",
  keywords: ["Updesh Shrivastava", "AI Systems Builder", "Senior PM", "Nürnberg", "GDPR", "AI agents"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
