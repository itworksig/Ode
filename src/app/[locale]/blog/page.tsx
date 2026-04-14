import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllPosts } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

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

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}`, label: t.nav.home },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />

      <main className="page-frame">
        <h1 className="page-title">{t.blog.title}</h1>
        <p className="blog-description">{t.blog.description}</p>

        <ul className="blog-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <span className="article-date">{post.date}</span>
              {" – "}
              <Link href={`/${locale}/blog/${post.year}/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="site-footer">
        <p>{t.footer.text}</p>
      </footer>
    </div>
  );
}
