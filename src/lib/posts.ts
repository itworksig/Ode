import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  year: string;
  title: string;
  date: string;
  category: string;
  readingTime: string;
  summary: string;
  eyebrow: string;
  featured: boolean;
};

export type Post = PostMeta & {
  content: string;
};

/** Returns all { year, slug } pairs from posts/YYYY/slug.mdx */
function readPostEntries(): Array<{ year: string; slug: string }> {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const entries: Array<{ year: string; slug: string }> = [];

  for (const year of fs.readdirSync(POSTS_DIR)) {
    const yearDir = path.join(POSTS_DIR, year);
    if (!fs.statSync(yearDir).isDirectory()) continue;
    if (!/^\d{4}$/.test(year)) continue;

    for (const file of fs.readdirSync(yearDir)) {
      if (!file.endsWith(".mdx")) continue;
      entries.push({ year, slug: file.replace(/\.mdx$/, "") });
    }
  }

  return entries;
}

function parsePost(year: string, slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, year, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    year,
    title: data.title ?? slug,
    date: data.date
      ? data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date).slice(0, 10)
      : "",
    category: data.category ?? "",
    readingTime: data.readingTime ?? "",
    summary: data.summary ?? "",
    eyebrow: data.eyebrow ?? "",
    featured: data.featured === true,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return readPostEntries()
    .map(({ year, slug }) => parsePost(year, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostBySlug(year: string, slug: string): Post | null {
  return parsePost(year, slug);
}
