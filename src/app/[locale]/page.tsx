import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getAllPosts, getFeaturedPosts } from "@/lib/posts";
import { getSiteConfig } from "@/lib/config";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}

function IntroMark() {
  return (
    <svg
      className="intro-box__mark"
      viewBox="0 0 64 90"
      width="56"
      height="79"
      fill="none"
      aria-hidden="true"
    >
      {/* String */}
      <line x1="32" y1="0" x2="32" y2="8" stroke="#7c6f64" strokeWidth="1.4" strokeLinecap="round"/>
      {/* Top cap */}
      <path d="M14 8 Q32 4 50 8 L47 16 Q32 13 17 16 Z"
        fill="rgba(213,196,161,0.7)" stroke="#665c54" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* Body */}
      <path d="M17 16 Q8 40 11 66 Q18 78 32 80 Q46 78 53 66 Q56 40 47 16 Z"
        fill="rgba(249,245,215,0.5)" stroke="#665c54" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* Vertical ribs */}
      <path d="M20 17 Q14 42 16 65" stroke="#a89984" strokeWidth="1" strokeOpacity="0.5"/>
      <path d="M32 16 L32 80"       stroke="#a89984" strokeWidth="1" strokeOpacity="0.5"/>
      <path d="M44 17 Q50 42 48 65" stroke="#a89984" strokeWidth="1" strokeOpacity="0.5"/>
      {/* Horizontal bands */}
      <path d="M15 36 Q32 31 49 36" fill="none" stroke="#a89984" strokeWidth="1" strokeOpacity="0.55"/>
      <path d="M13 54 Q32 49 51 54" fill="none" stroke="#a89984" strokeWidth="1" strokeOpacity="0.55"/>
      {/* Inner warm glow */}
      <ellipse cx="32" cy="50" rx="12" ry="20" fill="rgba(213,196,161,0.2)"/>
      {/* Bottom cap */}
      <path d="M15 66 Q32 72 49 66 L47 76 Q32 81 17 76 Z"
        fill="rgba(213,196,161,0.7)" stroke="#665c54" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* Tassel */}
      <line x1="32" y1="80" x2="32" y2="88" stroke="#665c54" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M26 88 Q32 92 38 88" fill="none" stroke="#665c54" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) redirect("/en");

  const t = getMessages(locale as Locale);
  const cfg = getSiteConfig();
  const recentPosts = getAllPosts().slice(0, cfg.recent.limit);
  const featuredPosts = getFeaturedPosts();

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}/about`, label: t.nav.about },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />

      <main className="page-frame">
        <h1 className="page-title">{cfg.site.name}</h1>
        <p className="page-subtitle">{cfg.site.subtitle}</p>

        <div className="intro-box">
          <IntroMark />
          <p>{cfg.site.description}</p>
        </div>

        <section className="home-section">
          <h2>{t.recent.title}</h2>
          <ul className="article-list">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <span className="article-date">{formatDate(post.date)}</span>
                {" – "}
                <Link href={`/${locale}/blog/${post.year}/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/blog`} className="text-link">
            {t.recent.more}
          </Link>
        </section>

        {cfg.featured.enabled && featuredPosts.length > 0 && (
          <section className="home-section" id="featured">
            <h2>{t.featured.title}</h2>
            <ul className="pub-list">
              {featuredPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/${locale}/blog/${post.year}/${post.slug}`}>{post.title}</Link>
                  <br />
                  <span className="pub-summary">{post.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {cfg.notebook.tags.length > 0 && (
          <section className="home-section" id="notes">
            <h2>{t.notebook.title}</h2>
            <div className="tag-list">
              {cfg.notebook.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
        )}

        {cfg.projects.length > 0 && (
          <section className="home-section" id="projects">
            <h2>{t.projects.title}</h2>
            <ul className="project-list">
              {cfg.projects.map((p) => (
                <li key={p.url}>
                  <a href={p.url}>{p.name}</a>
                  {p.description && <> – {p.description}</>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {cfg.links.length > 0 && (
          <section className="home-section" id="links">
            <h2>{t.links.title}</h2>
            <ul className="quick-links">
              {cfg.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url}>{l.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <p>{t.footer.text}</p>
        <p className="footer-meta">
          {t.footer.served} <code>{cfg.footer.version}</code>,{" "}
          {t.footer.source}{" "}
          <a href={cfg.footer.github}>here</a>.
        </p>
      </footer>
    </div>
  );
}
