import fs from "fs";
import path from "path";

export interface NavLink {
  href: string;
  label: string;
  visible: boolean;
}

export interface FeaturedProject {
  title: string;
  description: string;
  tags: string[];
  href: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
  };
  nav: NavLink[];
  home: {
    badge: string;
    headline: string;
    subheadline: string;
    proofPoints: string[];
    social: {
      github: string;
      twitter: string;
      linkedin: string;
    };
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    featuredWork: FeaturedProject[];
    ctaSection: {
      title: string;
      description: string;
      buttonLabel: string;
      buttonHref: string;
    };
  };
}

const CONFIG_PATH = path.join(process.cwd(), "content/config.json");

export function getSiteConfig(): SiteConfig {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(raw) as SiteConfig;
  } catch {
    // Return safe defaults if config is missing or malformed
    return {
      brand: { name: "Updesh Shrivastava", tagline: "AI Systems Builder" },
      nav: [
        { href: "/", label: "Home", visible: true },
        { href: "/about", label: "About", visible: true },
        { href: "/principles", label: "Principles", visible: true },
        { href: "/work", label: "Work", visible: true },
        { href: "/writing", label: "Writing", visible: true },
        { href: "/contact", label: "Contact", visible: true },
      ],
      home: {
        badge: "Building in Public · Nürnberg, Germany",
        headline:
          "Building AI agent systems that run what I used to manage manually",
        subheadline:
          "Senior PM · AI Systems Builder · 22 years enterprise delivery",
        proofPoints: [],
        social: { github: "#", twitter: "#", linkedin: "#" },
        ctaPrimary: { label: "View my work", href: "/work" },
        ctaSecondary: { label: "Read my writing", href: "/writing" },
        featuredWork: [],
        ctaSection: {
          title: "Let's work together",
          description: "Have an interesting project or just want to chat?",
          buttonLabel: "Get in touch",
          buttonHref: "/contact",
        },
      },
    };
  }
}
