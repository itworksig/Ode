import GithubSlugger from "github-slugger";

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [label](url) → label
    .replace(/[*_`~]/g, "")                   // bold/italic/code markers
    .trim();
}

/** Extract h2/h3 headings from raw MDX source, skipping fenced code blocks. */
export function extractToc(content: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const slugger = new GithubSlugger();
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
      const text = stripInlineMarkdown(m[2]);
      entries.push({
        level: m[1].length as 2 | 3,
        text,
        id: slugger.slug(text),
      });
    }
  }

  return entries;
}
