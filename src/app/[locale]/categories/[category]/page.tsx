import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getNavLinks } from "@/lib/nav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  const cats = getAllCategories();
  return locales.flatMap((locale) =>
    cats.map((cat) => ({ locale, category: cat.slug }))
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, category } = await params;
  if (!isValidLocale(locale)) redirect("/en");

  const t = getMessages(locale as Locale);
  const cats = getAllCategories();
  const catInfo = cats.find((c) => c.slug === category);
  if (!catInfo) notFound();

  const posts = getPostsByCategory(category);

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.archive },
    { href: `/${locale}/categories`, label: "Categories" },
    { href: `/${locale}`, label: t.nav.home },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />
      <main className="page-frame">
        <div className="page-intro">
          <p className="eyebrow">Category</p>
          <h1>{catInfo.name}</h1>
          <p>{catInfo.count} post{catInfo.count !== 1 ? "s" : ""}</p>
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
