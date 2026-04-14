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
 */

const TYPES = ["note", "info", "warning", "danger", "tip", "stale"] as const;
type AdmonitionType = (typeof TYPES)[number];

export function preprocessAdmonitions(source: string): string {
  // Match :::type (optional attrs) ... ::: blocks (non-greedy, multiline)
  return source.replace(
    /:::(\w+)([^\n]*)\n([\s\S]*?):::/g,
    (_, rawType: string, attrs: string, body: string) => {
      const type = rawType.toLowerCase() as AdmonitionType;
      if (!TYPES.includes(type)) return _;

      const tag = type.charAt(0).toUpperCase() + type.slice(1);
      const trimmedAttrs = attrs.trim();

      // For stale, the first attr token is the ISO date
      if (type === "stale" && trimmedAttrs) {
        const date = trimmedAttrs.split(/\s+/)[0];
        return `<${tag} since="${date}">\n${body}</${tag}>`;
      }

      return `<${tag}>\n${body}</${tag}>`;
    }
  );
}
