import { getAllPosts } from "@/lib/posts";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-static";

export async function GET() {
  const cfg = getSiteConfig();
  const base = cfg.site.url.replace(/\/$/, "");
  const locale = cfg.site.locale;
  const posts = getAllPosts();

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: cfg.site.name,
    home_page_url: base,
    feed_url: `${base}/feed.json`,
    description: cfg.site.description || cfg.site.subtitle,
    items: posts.map((post) => {
      const url = `${base}/${locale}/blog/${post.year}/${post.slug}`;
      return {
        id: url,
        url,
        title: post.title,
        summary: post.summary || undefined,
        date_published: `${post.date}T00:00:00Z`,
        tags: post.tags.length ? post.tags : undefined,
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
