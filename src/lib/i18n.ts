import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// ── Supported locales ─────────────────────────────────────

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isValidLocale(s: string): s is Locale {
  return (locales as readonly string[]).includes(s);
}

// ── Message shape ─────────────────────────────────────────

export type Messages = {
  nav: {
    blog: string;
    notes: string;
    about: string;
    archive: string;
    home: string;
    lang_switch: string;
  };
  recent: { title: string; more: string };
  featured: { title: string };
  notebook: { title: string };
  about: { title: string; description: string };
  projects: { title: string };
  links: { title: string };
  blog: { title: string; description: string };
  footer: { text: string; served: string; source: string };
};

// ── Loader (reads from /locales/*.yaml) ───────────────────

const cache = new Map<Locale, Messages>();

export function getMessages(locale: Locale): Messages {
  if (process.env.NODE_ENV === "production" && cache.has(locale)) {
    return cache.get(locale)!;
  }
  const file = path.join(process.cwd(), "locales", `${locale}.yaml`);
  const raw = yaml.load(fs.readFileSync(file, "utf-8")) as Messages;
  cache.set(locale, raw);
  return raw;
}

// ── Alternate locale helper ───────────────────────────────

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "zh" : "en";
}
