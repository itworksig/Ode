/**
 * Preprocesses MDX source to convert :::type … ::: blocks into JSX component tags.
 *
 * Supported variants:
 *   :::note          → <Note>…</Note>
 *   :::info          → <Info>…</Info>
 *   :::warning       → <Warning>…</Warning>
 *   :::danger        → <Danger>…</Danger>
 *   :::tip           → <Tip>…</Tip>
 *   :::stale DATE    → <Stale since="DATE">…</Stale>
 *
 * The opening and closing ::: must appear at the start of a line.
 * Content inside fenced code blocks (``` or ~~~) is not processed.
 */

const TYPES = ["note", "info", "warning", "danger", "tip", "stale"] as const;
type AdmonitionType = (typeof TYPES)[number];

function convertAdmonitions(text: string): string {
  // Require ::: at the start of a line (multiline mode) to avoid matching
  // :::type patterns inside table cells or inline code spans.
  return text.replace(
    /^:::(\w+)([^\n]*)\n([\s\S]*?)^:::/gm,
    (_, rawType: string, attrs: string, body: string) => {
      const type = rawType.toLowerCase() as AdmonitionType;
      if (!TYPES.includes(type)) return _;

      const tag = type.charAt(0).toUpperCase() + type.slice(1);
      const trimmedAttrs = attrs.trim();

      if (type === "stale" && trimmedAttrs) {
        const date = trimmedAttrs.split(/\s+/)[0];
        return `<${tag} since="${date}">\n${body}</${tag}>`;
      }

      return `<${tag}>\n${body}</${tag}>`;
    }
  );
}

export function preprocessAdmonitions(source: string): string {
  // Split the source into fenced-code-block segments and everything else.
  // Fenced code blocks (``` or ~~~) are passed through unchanged so that
  // :::type examples shown inside code fences are not converted.
  const segments: Array<{ text: string; isCode: boolean }> = [];
  // Match fenced code blocks: opening fence, optional info string, content, closing fence.
  const fenceRe = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1[ \t]*$/gm;
  let lastIndex = 0;

  for (const match of source.matchAll(fenceRe)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ text: source.slice(lastIndex, start), isCode: false });
    }
    segments.push({ text: match[0], isCode: true });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < source.length) {
    segments.push({ text: source.slice(lastIndex), isCode: false });
  }

  return segments
    .map(({ text, isCode }) => (isCode ? text : convertAdmonitions(text)))
    .join("");
}
