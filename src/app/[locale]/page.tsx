import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportBox from "@/components/SupportBox";
import { getNavLinks } from "@/lib/nav";
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
  /* Abstract network graph — nodes + edges */
  const nodes = [
    { id: "hub", cx: 36, cy: 42, r: 5.5, op: 1 },
    { id: "a",   cx: 36, cy: 10, r: 3,   op: 0.85 },
    { id: "b",   cx: 60, cy: 24, r: 2.5, op: 0.75 },
    { id: "c",   cx: 62, cy: 52, r: 2.5, op: 0.75 },
    { id: "d",   cx: 44, cy: 70, r: 2,   op: 0.65 },
    { id: "e",   cx: 18, cy: 66, r: 2,   op: 0.65 },
    { id: "f",   cx: 10, cy: 38, r: 2.5, op: 0.75 },
    { id: "g",   cx: 18, cy: 18, r: 2,   op: 0.65 },
  ];
  const edges = [
    ["hub","a"],["hub","b"],["hub","c"],["hub","f"],
    ["a","b"],["a","g"],["b","c"],["c","d"],["f","g"],["f","e"],["e","d"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <svg
      className="intro-box__mark"
      viewBox="0 0 72 80"
      width="58"
      height="65"
      fill="none"
      aria-hidden="true"
    >
      {/* Faint outer ring hint */}
      <circle cx="36" cy="42" r="34" stroke="#a89984" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 5"/>
      {/* Edges */}
      {edges.map(([s, t]) => {
        const a = byId[s], b = byId[t];
        return (
          <line key={`${s}-${t}`}
            x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
            stroke="#7c6f64" strokeWidth="1" strokeOpacity="0.45"
          />
        );
      })}
      {/* Nodes */}
      {nodes.map((n) => (
        <circle key={n.id}
          cx={n.cx} cy={n.cy} r={n.r}
          fill="#7c6f64" fillOpacity={n.op}
        />
      ))}
      {/* Hub accent ring */}
      <circle cx="36" cy="42" r="9" stroke="#9e0146" strokeWidth="1" strokeOpacity="0.35" fill="none"/>
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

  const navLinks = getNavLinks(locale, t);

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
              <li key={`${post.year}-${post.slug}`}>
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
                <li key={`${post.year}-${post.slug}`}>
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

        {cfg.support.enabled && cfg.support.links.length > 0 && (
          <section className="home-section" id="support">
            <SupportBox
              title={cfg.support.title}
              description={cfg.support.description}
              links={cfg.support.links}
            />
          </section>
        )}
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
