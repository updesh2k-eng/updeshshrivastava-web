// ── Site config ───────────────────────────────────────────────────────────────

export interface NavLink { href: string; label: string; visible: boolean }
export interface FeaturedProject { title: string; description: string; tags: string[]; href: string }
export interface SiteConfig {
  brand: { name: string; tagline: string };
  nav: NavLink[];
  home: {
    badge: string; headline: string; subheadline: string;
    proofPoints: string[];
    social: { github: string; twitter: string; linkedin: string };
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    featuredWork: FeaturedProject[];
    ctaSection: { title: string; description: string; buttonLabel: string; buttonHref: string };
  };
}

// ── GitHub API ────────────────────────────────────────────────────────────────

export type GHFile = { name: string; sha: string; path: string };
export type GHContent = { sha: string; content: string };

// ── Posts ─────────────────────────────────────────────────────────────────────

export interface PostFields {
  title: string;
  date: string;
  excerpt: string;
  tags: string; // comma-separated for the form
  readTime: string;
  content: string;
}

export type SBPostRow = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  published_at: string | null;
  views: number;
  created_at: string;
};

export interface SBForm {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  status: "draft" | "published";
  cover_image: string;
  read_time: string;
  content_html: string;
}

// ── View routing ──────────────────────────────────────────────────────────────

export type View =
  | { name: "login" }
  | { name: "dashboard" }
  | { name: "posts" }
  | { name: "new" }
  | { name: "edit"; id: string }
  | { name: "nav" }
  | { name: "home" }
  | { name: "images" }
  | { name: "memory" };
