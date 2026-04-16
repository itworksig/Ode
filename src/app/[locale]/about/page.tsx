import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getNavLinks } from "@/lib/nav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteConfig } from "@/lib/config";
import { getAboutConfig } from "@/lib/about";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const about = getAboutConfig();
  return { title: about.title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect("/en/about");

  const t = getMessages(locale as Locale);
  const cfg = getSiteConfig();
  const about = getAboutConfig();

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}/about`, label: t.nav.about },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />

      <main className="page-frame">
        <h1 className="page-title">{about.title}</h1>
        <p className="page-subtitle">{cfg.site.subtitle}</p>

        <div className="about-body">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {about.links.length > 0 && (
            <ul className="about-links">
              {about.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url}>{l.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
