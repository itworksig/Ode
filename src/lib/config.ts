import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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

function getGitVersion(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
  } catch {
    return "unknown";
  }
}

export type Project = { name: string; url: string; description: string };
export type QuickLink = { label: string; url: string };

export type SiteConfig = {
  disqus: { shortname: string };
  site: {
    name: string;
    brand: string;
    locale: string;
    subtitle: string;
    description: string;
    url: string;
  };
  recent: { limit: number };
  featured: { enabled: boolean };
  notebook: { tags: string[] };
  projects: Project[];
  links: QuickLink[];
  sponsor: { enabled: boolean; label: string; url: string };
  support: { enabled: boolean; title: string; description: string; links: QuickLink[] };
  footer: { github: string; version: string };
};

export function getSiteConfig(): SiteConfig {
  const file = path.join(process.cwd(), "config.ini");
  const r = parseIni(fs.readFileSync(file, "utf-8"));

  const projects: Project[] = parseEntries(r.projects, 3).map(([name, url, description]) => ({
    name, url, description,
  }));

  const links: QuickLink[] = parseEntries(r.links, 2).map(([label, url]) => ({ label, url }));

  const supportLinks: QuickLink[] = parseEntries(r.support, 2).map(([label, url]) => ({
    label, url,
  }));

  return {
    disqus: {
      shortname: r.disqus?.shortname ?? "",
    },
    site: {
      name:        r.site?.name        ?? "Ode",
      brand:       r.site?.brand       ?? r.site?.name ?? "Ode",
      locale:      r.site?.locale      ?? "en",
      subtitle:    r.site?.subtitle    ?? "",
      description: r.site?.description ?? "",
      url:         r.site?.url         ?? "https://localhost:3000",
    },
    recent:   { limit: parseInt(r.recent?.limit ?? "7", 10) || 7 },
    featured: { enabled: r.featured?.enabled !== "false" },
    notebook: {
      tags: (r.notebook?.tags ?? "")
        .split(",").map((t) => t.trim()).filter(Boolean),
    },
    projects,
    links,
    sponsor: {
      enabled: r.sponsor?.enabled === "true",
      label:   r.sponsor?.label ?? "Sponsor",
      url:     r.sponsor?.url   ?? "",
    },
    support: {
      enabled:     r.support?.enabled === "true",
      title:       r.support?.title       ?? "Support My Work",
      description: r.support?.description ?? "",
      links:       supportLinks,
    },
    footer: {
      github:  r.footer?.github ?? "",
      version: getGitVersion(),
    },
  };
}
