import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getNavLinks } from "@/lib/nav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string; tag: string }> };

export function generateStaticParams() {
  const tags = getAllTags();
  return locales.flatMap((locale) =>
    tags.map((tag) => ({ locale, tag: tag.slug }))
  );
}

export default async function TagPage({ params }: PageProps) {
  const { locale, tag } = await params;
  if (!isValidLocale(locale)) redirect("/en");

  const t = getMessages(locale as Locale);
  const tags = getAllTags();
  const tagInfo = tags.find((t) => t.slug === tag);
  if (!tagInfo) notFound();

  const posts = getPostsByTag(tag);

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.archive },
    { href: `/${locale}/tags`, label: "Tags" },
    { href: `/${locale}`, label: t.nav.home },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />
      <main className="page-frame">
        <div className="page-intro">
          <p className="eyebrow">Tag</p>
          <h1>{tagInfo.name}</h1>
          <p>{tagInfo.count} post{tagInfo.count !== 1 ? "s" : ""}</p>
        </div>

        <ul className="blog-list">
          {posts.map((post) => (
            <li key={`${post.year}/${post.slug}`}>
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
