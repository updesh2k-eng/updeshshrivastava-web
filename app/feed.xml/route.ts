import { getPublishedPosts } from "@/lib/supabase-posts";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SITE_URL = "https://updeshshrivastava.com";

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts().catch(() => []);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/writing/${post.slug}`;
      const date = new Date(post.published_at ?? post.created_at).toUTCString();
      const categories = post.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("\n      ");
      return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(post.excerpt)}</description>
      <pubDate>${date}</pubDate>
      ${categories}
      ${post.cover_image ? `<enclosure url="${xmlEscape(post.cover_image)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Updesh Shrivastava — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>AI systems, enterprise delivery, and building in public. Senior PM · Nürnberg, Germany.</description>
    <language>en</language>
    <managingEditor>updesh2k@gmail.com (Updesh Shrivastava)</managingEditor>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
