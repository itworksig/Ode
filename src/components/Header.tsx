import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";
import SearchBox, { type SearchEntry } from "@/components/SearchBox";

function OdeMark() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="22"
      height="22"
      fill="none"
      aria-hidden="true"
    >
      {/* Hexagon */}
      <polygon
        points="16,2 28,9 28,23 16,30 4,23 4,9"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* Inner graph — every other vertex to center */}
      <line x1="16" y1="2"  x2="16" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55"/>
      <line x1="28" y1="23" x2="16" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55"/>
      <line x1="4"  y1="23" x2="16" y2="16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.55"/>
      {/* Center node */}
      <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
      {/* Outer vertex dots */}
      <circle cx="16" cy="2"  r="1.6" fill="currentColor" fillOpacity="0.65"/>
      <circle cx="28" cy="23" r="1.6" fill="currentColor" fillOpacity="0.65"/>
      <circle cx="4"  cy="23" r="1.6" fill="currentColor" fillOpacity="0.65"/>
    </svg>
  );
}

export type NavLink = { href: string; label: string };

type Props = {
  links: NavLink[];
  locale: Locale;
};

export default function Header({ links, locale }: Props) {
  const { site } = getSiteConfig();
  const searchIndex: SearchEntry[] = getAllPosts().map((p) => ({
    slug: p.slug,
    year: p.year,
    title: p.title,
    date: p.date,
    summary: p.summary,
    category: p.category,
    tags: p.tags,
  }));

  return (
    <header className="topbar">
      <nav className="topbar__nav">
        <Link href={`/${locale}`} className="brand">
          <OdeMark />
          {site.brand}
        </Link>
        <div className="topbar__links">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="search-trigger-wrapper">
          <SearchBox posts={searchIndex} locale={locale} />
        </div>
      </nav>
    </header>
  );
}
