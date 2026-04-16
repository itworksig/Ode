import Link from "next/link";
import type { TranslationSibling } from "@/lib/posts";

type Props = {
  translations: TranslationSibling[];
  locale: string;
};

export default function TranslationBanner({ translations, locale }: Props) {
  if (translations.length === 0) return null;
  return (
    <aside className="translation-banner" role="note">
      <span className="translation-banner__icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/>
          <path d="M2 5h12"/><path d="M7 2h1"/>
          <path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/>
        </svg>
      </span>
      <span className="translation-banner__text">
        This post is also available in{" "}
        {translations.map((t, i) => (
          <span key={t.lang}>
            {i > 0 && ", "}
            <Link
              href={t.isDefault
                ? `/${locale}/blog/${t.year}/${t.slug}`
                : `/${locale}/blog/${t.year}/${t.slug}/${t.lang}`}
              className="translation-banner__link"
            >
              {t.langName}
            </Link>
          </span>
        ))}.
      </span>
    </aside>
  );
}
