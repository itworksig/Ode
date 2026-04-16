import type { Messages } from "./i18n";

/** Consistent nav links used across all pages */
export function getNavLinks(locale: string, t: Messages) {
  return [
    { href: `/${locale}/blog`, label: t.nav.blog },
    { href: `/${locale}/about`, label: t.nav.about },
  ];
}
