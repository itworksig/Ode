import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getNavLinks } from "@/lib/nav";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleBlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect("/en/blog");

  const t = getMessages(locale as Locale);
  const posts = getAllPosts();
  const navLinks = getNavLinks(locale, t);

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />

      <main className="page-frame">
        <h1 className="page-title">{t.blog.title}</h1>
        <p className="blog-description">{t.blog.description}</p>

        <p className="feed-notice">
          If you have a compatible reader, check out the{" "}
          <a href="/rss.xml">RSS feed</a> for automatic updates.
          Also available as a{" "}
          <a href="/feed.json">JSONFeed</a>.
        </p>

        <ul className="blog-list">
          {posts.map((post) => (
            <li key={`${post.year}-${post.slug}`}>
              <span className="article-date">{post.date}</span>
              {" – "}
              <Link href={`/${locale}/blog/${post.year}/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
