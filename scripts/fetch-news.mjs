#!/usr/bin/env node
/**
 * Daily AI news fetcher
 * Pulls from 9 free RSS sources → Claude Haiku scores relevance → upserts to Supabase
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL   — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY  — bypasses RLS for inserts
 *   ANTHROPIC_API_KEY          — optional; without it all items are inserted unfiltered
 */

import { XMLParser } from "fast-xml-parser";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

// ─── Sources ─────────────────────────────────────────────────────────────────

const SOURCES = [
  {
    name: "TechCrunch",
    url: "https://feeds.feedburner.com/techcrunch/artificial-intelligence",
    siteUrl: "https://techcrunch.com/category/artificial-intelligence/",
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    siteUrl: "https://www.theverge.com/ai-artificial-intelligence",
  },
  {
    name: "VentureBeat",
    url: "https://venturebeat.com/category/ai/feed/",
    siteUrl: "https://venturebeat.com/ai/",
  },
  {
    name: "MIT Tech Review",
    url: "https://www.technologyreview.com/feed/",
    siteUrl: "https://www.technologyreview.com/topic/artificial-intelligence/",
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/tag/artificial-intelligence/latest/rss",
    siteUrl: "https://www.wired.com/tag/artificial-intelligence/",
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    siteUrl: "https://openai.com/blog",
  },
  {
    name: "DeepMind",
    url: "https://deepmind.google/blog/rss.xml",
    siteUrl: "https://deepmind.google/blog/",
  },
  {
    name: "Hacker News",
    url: "https://hnrss.org/newest?q=LLM+AI+GPT+machine+learning+neural+llama+anthropic+openai&count=30&points=10",
    siteUrl: "https://news.ycombinator.com",
  },
  {
    name: "arXiv CS.AI",
    url: "https://export.arxiv.org/rss/cs.AI",
    siteUrl: "https://arxiv.org/list/cs.AI/recent",
  },
];

const MIN_SCORE = 7;       // articles below this score are dropped
const MAX_PER_SOURCE = 12; // items to consider per source per run
const CLAUDE_BATCH = 8;    // articles per Claude API call (keeps prompts focused)
const FETCH_TIMEOUT_MS = 15_000;

// ─── XML Parser ───────────────────────────────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  allowBooleanAttributes: true,
  parseTagValue: true,
  trimValues: true,
  cdataPropName: "__cdata",
});

// ─── RSS/Atom helpers ─────────────────────────────────────────────────────────

function asText(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (val["#text"]) return String(val["#text"]);
  if (val.__cdata) return String(val.__cdata);
  return String(val);
}

function stripHtml(html) {
  return asText(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/\s+/g, " ").trim();
}

function extractImage(item) {
  // Try: media:content, media:thumbnail, enclosure, then first <img> in HTML
  const mc = item["media:content"];
  if (mc?.["@_url"]) return mc["@_url"];
  if (Array.isArray(mc)) {
    const img = mc.find((m) => m["@_url"]);
    if (img) return img["@_url"];
  }
  const mt = item["media:thumbnail"];
  if (mt?.["@_url"]) return mt["@_url"];
  const enc = item.enclosure;
  if (enc?.["@_url"] && /image/i.test(enc["@_type"] ?? "")) return enc["@_url"];
  // Extract from HTML body
  const html = asText(item["content:encoded"] || item.description || "");
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function parseDate(str) {
  if (!str) return null;
  try {
    const d = new Date(asText(str));
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

function urlHash(url) {
  return crypto.createHash("sha256").update(url).digest("hex").slice(0, 32);
}

// Resolve the canonical article link from an RSS item
function resolveLink(item) {
  // RSS 2.0 <link> can be: string, object with #text, CDATA
  const raw = item.link;
  if (typeof raw === "string" && raw.startsWith("http")) return raw;
  if (raw?.["#text"]) return raw["#text"];
  if (raw?.__cdata) return raw.__cdata;
  // guid as fallback (often a permalink)
  const guid = item.guid;
  if (typeof guid === "string" && guid.startsWith("http")) return guid;
  if (guid?.["#text"]) return guid["#text"];
  return null;
}

// ─── Feed fetcher ─────────────────────────────────────────────────────────────

async function fetchFeed(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AINewsBot/1.0; +https://updeshshrivastava.com)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const xml = await res.text();
    const doc = xmlParser.parse(xml);

    // ── RSS 2.0 ───────────────────────────────────────────────────────────────
    const channel = doc?.rss?.channel;
    if (channel) {
      const rawItems = Array.isArray(channel.item) ? channel.item
        : channel.item ? [channel.item] : [];
      return rawItems.slice(0, MAX_PER_SOURCE).flatMap((item) => {
        const url = resolveLink(item);
        if (!url) return [];
        const title = stripHtml(item.title);
        if (!title) return [];
        return [{
          id: urlHash(url),
          title,
          url,
          excerpt: stripHtml(item["content:encoded"] || item.description || "").slice(0, 400),
          image_url: extractImage(item),
          published_at: parseDate(item.pubDate || item["dc:date"]),
          source: source.name,
          source_url: source.siteUrl,
        }];
      });
    }

    // ── Atom ──────────────────────────────────────────────────────────────────
    const feed = doc?.feed;
    if (feed) {
      const rawEntries = Array.isArray(feed.entry) ? feed.entry
        : feed.entry ? [feed.entry] : [];
      return rawEntries.slice(0, MAX_PER_SOURCE).flatMap((entry) => {
        // Atom <link> can be an array of link objects or a single one
        let url = null;
        if (Array.isArray(entry.link)) {
          const alt = entry.link.find((l) => !l["@_rel"] || l["@_rel"] === "alternate");
          url = (alt ?? entry.link[0])?.["@_href"] ?? null;
        } else if (entry.link?.["@_href"]) {
          url = entry.link["@_href"];
        } else if (typeof entry.link === "string") {
          url = entry.link;
        } else if (entry.id) {
          url = asText(entry.id);
        }
        if (!url) return [];
        const title = stripHtml(entry.title);
        if (!title) return [];
        return [{
          id: urlHash(url),
          title,
          url,
          excerpt: stripHtml(
            entry.summary?.["#text"] || entry.summary || entry.content?.["#text"] || entry.content || ""
          ).slice(0, 400),
          image_url: extractImage(entry),
          published_at: parseDate(entry.published || entry.updated),
          source: source.name,
          source_url: source.siteUrl,
        }];
      });
    }

    console.warn(`[${source.name}] Unrecognised feed format`);
    return [];
  } catch (err) {
    console.warn(`[${source.name}] fetch failed: ${err.message}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ─── Claude scoring ───────────────────────────────────────────────────────────

const CATEGORY_LIST = "LLMs | Research | Tools | Policy | Robotics | Industry";

const SYSTEM_PROMPT = `You are a senior AI editor curating a feed for AI practitioners and researchers.
Your job: score each article and assign a category.

Scoring (1–10):
- 9–10: Essential — major model release, landmark research, significant policy change, breakthrough tool
- 7–8: Good — relevant AI development with real substance, clear signal
- 5–6: Marginal — tangentially AI, speculative, or low-signal
- 1–4: Reject — clickbait, "10 ways AI will...", generic company press release, mentions AI in passing

Categories: ${CATEGORY_LIST}
- LLMs: language models, chatbots, foundation models, GPT/Claude/Gemini/Llama
- Research: papers, benchmarks, new architectures, technical findings
- Tools: developer tools, APIs, SDKs, open-source frameworks
- Policy: regulation, governance, ethics guidelines, AI safety policy, legislation
- Robotics: embodied AI, physical robots, autonomous vehicles
- Industry: funding, acquisitions, partnerships, business strategy

Rules:
- Be strict — borderline articles should score 6 or below (rejected)
- arXiv papers: score 8+ only if the abstract suggests a real advance, not incremental work
- Hacker News: look past the HN framing to the underlying article quality`;

async function scoreWithClaude(items, anthropic) {
  if (!anthropic || items.length === 0) {
    return items.map((i) => ({ ...i, relevance_score: null, category: "Uncategorized" }));
  }

  const results = [];

  for (let i = 0; i < items.length; i += CLAUDE_BATCH) {
    const batch = items.slice(i, i + CLAUDE_BATCH);
    const articlesText = batch
      .map((a, idx) =>
        `[${idx}] SOURCE: ${a.source}\nTITLE: ${a.title}\nEXCERPT: ${a.excerpt || "(no excerpt)"}`
      )
      .join("\n\n---\n\n");

    const userPrompt = `Score and categorise these articles. Respond ONLY with a JSON array, no prose.

${articlesText}

JSON format: [{"idx": 0, "score": 8, "category": "LLMs"}, ...]`;

    try {
      const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      });

      const responseText = msg.content[0]?.text?.trim() ?? "[]";
      // Extract JSON array even if wrapped in markdown code fence
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      batch.forEach((item, idx) => {
        const scored = parsed.find((p) => p.idx === idx);
        results.push({
          ...item,
          relevance_score: scored?.score ?? null,
          category: scored?.category ?? "Uncategorized",
        });
      });
    } catch (err) {
      console.warn(`Claude batch ${Math.floor(i / CLAUDE_BATCH) + 1} failed: ${err.message}`);
      // Don't discard — push without scoring so nothing is lost
      batch.forEach((item) => results.push({ ...item, relevance_score: null, category: "Uncategorized" }));
    }

    // Small pause between batches to stay within rate limits
    if (i + CLAUDE_BATCH < items.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
}

// ─── Cleanup: remove items older than 30 days ────────────────────────────────

async function cleanupOldItems(supabase) {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { error, count } = await supabase
    .from("news_items")
    .delete({ count: "exact" })
    .lt("published_at", cutoff);
  if (error) console.warn("Cleanup error:", error.message);
  else if (count > 0) console.log(`Cleaned up ${count} items older than 30 days`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Pre-flight: check required env vars ──────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL secret is missing from GitHub Actions secrets.");
    process.exit(1);
  }
  if (!serviceRoleKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY secret is missing from GitHub Actions secrets.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // ── Pre-flight: verify the news_items table exists ────────────────────────
  const { error: tableCheckError } = await supabase
    .from("news_items")
    .select("id")
    .limit(1);

  if (tableCheckError) {
    console.error("❌ Cannot access the news_items table:", tableCheckError.message);
    console.error("   → Have you run the SQL migration in Supabase?");
    console.error("   → File: supabase/migrations/20260415000000_news_items.sql");
    console.error("   → Go to: Supabase dashboard → SQL Editor → paste and run that file");
    process.exit(1);
  }
  console.log("✓ Supabase connection and news_items table OK");

  const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  if (!anthropic) {
    console.warn("⚠ ANTHROPIC_API_KEY not set — all new items will be inserted without relevance filtering.");
  } else {
    console.log("✓ Anthropic API key found — Claude scoring enabled");
  }

  // 1. Fetch all feeds in parallel
  console.log(`\nFetching ${SOURCES.length} RSS feeds…`);
  const feedResults = await Promise.all(SOURCES.map(fetchFeed));
  const allItems = feedResults.flat();
  console.log(`Fetched ${allItems.length} raw items across all sources`);

  // 2. Basic validity filter
  const validItems = allItems.filter(
    (i) => i.url && i.title && i.title.length > 10 && i.id
  );
  console.log(`${validItems.length} items passed basic validity check`);

  // 3. Dedup against DB — only process URLs we haven't seen yet
  const ids = [...new Set(validItems.map((i) => i.id))];
  const { data: existing, error: existingError } = await supabase
    .from("news_items")
    .select("id")
    .in("id", ids);
  if (existingError) console.warn("Dedup query warning:", existingError.message);
  const existingSet = new Set((existing ?? []).map((r) => r.id));
  const newItems = validItems.filter((i) => !existingSet.has(i.id));
  console.log(`${newItems.length} new items (${existingSet.size} already in DB)`);

  if (newItems.length === 0) {
    console.log("Nothing new. Done.\n");
    return;
  }

  // 4. Score + categorise with Claude
  console.log(`Scoring ${newItems.length} items with Claude Haiku…`);
  const scored = await scoreWithClaude(newItems, anthropic);

  // 5. Apply relevance filter (only when Claude is active)
  const toInsert = anthropic
    ? scored.filter((i) => i.relevance_score === null || i.relevance_score >= MIN_SCORE)
    : scored;

  const rejected = scored.length - toInsert.length;
  console.log(
    `${toInsert.length} passed relevance filter (score ≥ ${MIN_SCORE}), ${rejected} rejected`
  );

  if (toInsert.length === 0) {
    console.log("No items passed the quality filter today.\n");
    return;
  }

  // 6. Upsert to Supabase
  const { error } = await supabase
    .from("news_items")
    .upsert(toInsert, { onConflict: "id", ignoreDuplicates: false });

  if (error) {
    console.error("❌ Supabase upsert failed:", error.message);
    console.error("   Code:", error.code, "| Details:", error.details);
    process.exit(1);
  }
  console.log(`✓ Inserted/updated ${toInsert.length} news items`);

  // 7. Clean up stale items
  await cleanupOldItems(supabase);

  // Summary
  console.log("\nSummary by source:");
  const bySource = {};
  for (const item of toInsert) {
    bySource[item.source] = (bySource[item.source] ?? 0) + 1;
  }
  for (const [src, count] of Object.entries(bySource).sort()) {
    console.log(`  ${src.padEnd(16)} ${count}`);
  }
  console.log();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
