import { redirect } from "next/navigation";
import Link from "next/link";
import { getNavLinks } from "@/lib/nav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCategories } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect("/en/categories");

  const t = getMessages(locale as Locale);
  const categories = getAllCategories();

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.archive },
    { href: `/${locale}`, label: t.nav.home },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />
      <main className="page-frame">
        <div className="page-intro">
          <p className="eyebrow">Index</p>
          <h1>Categories</h1>
          <p>All posts grouped by category.</p>
        </div>

        <ul className="taxonomy-list">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link href={`/${locale}/categories/${cat.slug}`}>{cat.name}</Link>
              <span className="taxonomy-count">{cat.count}</span>
            </li>
          ))}
        </ul>
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
