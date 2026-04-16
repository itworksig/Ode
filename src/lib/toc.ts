export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Mirrors the ID format produced by rehype-slug (via github-slugger).
 * Must keep Unicode letters/numbers (Chinese, Arabic, Cyrillic, etc.)
 * and only strip ASCII punctuation + specific Unicode punctuation ranges.
 */
function slugify(text: string): string {
  // Strip inline markdown: bold/italic markers, inline code backticks, link syntax
  const stripped = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [label](url) → label
    .replace(/[*_`~]/g, "")                   // bold/italic/code markers
    .trim();

  // Match github-slugger: remove ASCII punctuation and Unicode punctuation blocks,
  // keep Unicode letters (Chinese, Arabic, Cyrillic, …) and digits.
  return stripped
    .toLowerCase()
    // eslint-disable-next-line no-useless-escape
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Extract h2/h3 headings from raw MDX source, skipping fenced code blocks. */
export function extractToc(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    // Detect both ``` and ~~~ fence openings/closings
    if (/^(`{3,}|~{3,})/.test(line.trimStart())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      entries.push({
        level: m[1].length as 2 | 3,
        text: m[2].trim(),
        id: slugify(m[2].trim()),
      });
    }
  }

  return entries;
}
