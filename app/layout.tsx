import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Updesh Shrivastava — Engineer & Builder",
    template: "%s | Updesh Shrivastava",
  },
  description:
    "Personal website of Updesh Shrivastava — software engineer, builder, and writer. Exploring ideas at the intersection of technology and creativity.",
  keywords: ["Updesh Shrivastava", "software engineer", "Next.js", "blog", "portfolio"],
  openGraph: {
    title: "Updesh Shrivastava — Engineer & Builder",
    description:
      "Personal website of Updesh Shrivastava — software engineer, builder, and writer.",
    url: "https://updeshshrivastava.com",
    siteName: "Updesh Shrivastava",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Updesh Shrivastava — Engineer & Builder",
    description:
      "Personal website of Updesh Shrivastava — software engineer, builder, and writer.",
    creator: "@updeshshrivastava",
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
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
