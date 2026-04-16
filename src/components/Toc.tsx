import { type TocEntry } from "@/lib/toc";

type Props = { entries: TocEntry[] };

export default function Toc({ entries }: Props) {
  if (entries.length < 2) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <p className="toc__title">Contents</p>
      <ol className="toc__list">
        {entries.map((e) => (
          <li key={e.id} className={`toc__item toc__item--h${e.level}`}>
            <a href={`#${e.id}`} className="toc__link">
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
