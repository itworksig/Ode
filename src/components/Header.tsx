import Link from "next/link";
import { type Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/config";

function OdeMark() {
  return (
    <svg
      viewBox="0 0 44 72"
      width="30"
      height="50"
      fill="none"
      aria-hidden="true"
    >
      {/* Lantern string */}
      <line x1="22" y1="0" x2="22" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Top cap */}
      <path d="M10 6 Q22 3 34 6 L32 12 Q22 10 12 12 Z"
        fill="rgba(213,196,161,0.6)" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      {/* Lantern body */}
      <path d="M12 12 Q6 30 8 50 Q13 58 22 60 Q31 58 36 50 Q38 30 32 12 Z"
        fill="rgba(249,245,215,0.45)" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Vertical ribs */}
      <path d="M14 13 Q10 32 11 50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.9"/>
      <path d="M22 12 L22 60"       stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.9"/>
      <path d="M30 13 Q34 32 33 50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.9"/>
      {/* Horizontal bands */}
      <path d="M11 28 Q22 24 33 28" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.9"/>
      <path d="M10 42 Q22 38 34 42" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.9"/>
      {/* Inner glow */}
      <ellipse cx="22" cy="37" rx="8" ry="13" fill="rgba(213,196,161,0.18)"/>
      {/* Bottom cap */}
      <path d="M10 50 Q22 54 34 50 L32 58 Q22 61 12 58 Z"
        fill="rgba(213,196,161,0.6)" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      {/* Tassel */}
      <line x1="22" y1="61" x2="22" y2="68" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M18 68 Q22 72 26 68" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
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
  return (
    <header className="topbar">
      <nav className="topbar__nav">
        <Link href={`/${locale}`} className="brand">
          <OdeMark />
          {site.brand}
        </Link>
        <div className="topbar__links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
