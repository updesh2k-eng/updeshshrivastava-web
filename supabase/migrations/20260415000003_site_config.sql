-- Site config table: stores the full SiteConfig JSON in a single row
-- Changes made via admin panel are reflected site-wide within 60 seconds (ISR)

CREATE TABLE IF NOT EXISTS public.site_config (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Seed with current config.json values
INSERT INTO public.site_config (key, value) VALUES (
  'main',
  '{
    "brand": {
      "name": "Updesh Shrivastava",
      "tagline": "AI Systems Builder"
    },
    "nav": [
      { "href": "/",           "label": "Home",       "visible": true },
      { "href": "/about",      "label": "About",      "visible": true },
      { "href": "/writing",    "label": "Writing",    "visible": true },
      { "href": "/work",       "label": "Work",       "visible": true },
      { "href": "/principles", "label": "Principles", "visible": true },
      { "href": "/ai-news",    "label": "AI News",    "visible": true },
      { "href": "/contact",    "label": "Contact",    "visible": true }
    ],
    "home": {
      "badge": "Erlangen Nürnberg, Germany",
      "headline": "Building AI agent systems that run what I used to manage manually",
      "subheadline": "Senior PM · AI Systems Builder · 22 years enterprise delivery",
      "proofPoints": [
        "22 years enterprise delivery across IBM · Infosys · GfK · Teradata · NCR · Wipro · Birlasoft",
        "Hybrid AI agent system — 7 specialist agents running under €30/month",
        "German citizen building GDPR-compliant AI for EU regulatory workflows"
      ],
      "social": {
        "github":   "https://github.com/updesh2k-eng",
        "twitter":  "https://twitter.com/updeshshrivastava",
        "linkedin": "https://www.linkedin.com/in/updesh-shrivastava/"
      },
      "ctaPrimary":   { "label": "View my work",      "href": "/work" },
      "ctaSecondary": { "label": "Read my writing",   "href": "/writing" },
      "featuredWork": [
        {
          "title": "Hybrid AI Agent System",
          "description": "7 specialist agents orchestrated to replace manual PM workflows — procurement, compliance, reporting — running under €30/month on commodity cloud infrastructure.",
          "tags": ["AI Agents", "LLM", "GDPR", "EU Compliance"],
          "href": "/work"
        },
        {
          "title": "EU Regulatory Workflow Automation",
          "description": "GDPR-compliant document processing pipeline built for German enterprise. Reduced manual review time by automating extraction, classification, and audit trail generation.",
          "tags": ["Automation", "Compliance", "NLP", "Enterprise"],
          "href": "/work"
        },
        {
          "title": "Enterprise Programme Delivery — GfK / Teradata",
          "description": "Led cross-functional delivery of analytics platform migrations across 12 markets. 22 years of enterprise PM discipline distilled into repeatable AI-assisted delivery frameworks.",
          "tags": ["Programme Management", "Analytics", "Multi-market", "Transformation"],
          "href": "/work"
        }
      ],
      "ctaSection": {
        "title":       "Let''s work together",
        "description": "Have an interesting project or just want to chat? I''m always open to new conversations.",
        "buttonLabel": "Get in touch",
        "buttonHref":  "/contact"
      }
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Anyone can read the config (needed for public pages)
DROP POLICY IF EXISTS "Public read site_config" ON public.site_config;
CREATE POLICY "Public read site_config"
  ON public.site_config FOR SELECT
  TO public
  USING (true);

-- Only authenticated admins can write
DROP POLICY IF EXISTS "Admin write site_config" ON public.site_config;
CREATE POLICY "Admin write site_config"
  ON public.site_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
