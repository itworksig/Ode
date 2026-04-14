import fs from "fs";
import path from "path";

type RawIni = Record<string, Record<string, string>>;

function parseIni(text: string): RawIni {
  const result: RawIni = {};
  let section = "__root__";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(";") || line.startsWith("#")) continue;
    if (line.startsWith("[") && line.endsWith("]")) {
      section = line.slice(1, -1).trim();
      if (!result[section]) result[section] = {};
      continue;
    }
    const eq = line.indexOf("=");
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (!result[section]) result[section] = {};
      result[section][key] = value;
    }
  }
  return result;
}

function parseEntries(section: Record<string, string> | undefined, parts: number): string[][] {
  if (!section) return [];
  return Object.entries(section)
    .filter(([k]) => /^\d+$/.test(k))
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([, v]) => {
      const cols = v.split("|").map((s) => s.trim());
      while (cols.length < parts) cols.push("");
      return cols.slice(0, parts);
    });
}

export type AboutLink = { label: string; url: string };

export type AboutConfig = {
  title: string;
  paragraphs: string[];
  links: AboutLink[];
};

export function getAboutConfig(): AboutConfig {
  const file = path.join(process.cwd(), "about.ini");
  const r = parseIni(fs.readFileSync(file, "utf-8"));

  return {
    title: r.about?.title ?? "About",
    paragraphs: parseEntries(r.body, 1).map(([p]) => p),
    links: parseEntries(r.links, 2).map(([label, url]) => ({ label, url })),
  };
}
