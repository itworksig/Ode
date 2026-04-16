import { getAllPosts } from "@/lib/posts";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-static";

function toRFC822(dateStr: string): string {
  return new Date(dateStr + "T00:00:00Z").toUTCString();
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const cfg = getSiteConfig();
  const base = cfg.site.url.replace(/\/$/, "");
  const locale = cfg.site.locale;
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${base}/${locale}/blog/${post.year}/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRFC822(post.date)}</pubDate>
      ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(cfg.site.name)}</title>
    <link>${base}</link>
    <description>${escapeXml(cfg.site.description || cfg.site.subtitle)}</description>
    <language>${locale}</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${posts[0] ? toRFC822(posts[0].date) : new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
