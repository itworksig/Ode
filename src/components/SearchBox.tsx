"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export type SearchEntry = {
  slug: string;
  year: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
};

type Props = { posts: SearchEntry[]; locale: string };

export default function SearchBox({ posts, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? posts
        .filter((p) => {
          const q = query.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 8)
    : [];

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search posts (⌘K)"
        title="Search (⌘K)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div className="search-overlay" onClick={close} aria-modal="true" role="dialog">
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal__bar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                className="search-modal__input"
                type="text"
                placeholder="Search posts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="search-modal__esc" onClick={close}>ESC</kbd>
            </div>

            <div className="search-modal__body">
              {results.length > 0 ? (
                <ul className="search-results">
                  {results.map((p) => (
                    <li key={`${p.year}/${p.slug}`}>
                      <Link
                        href={`/${locale}/blog/${p.year}/${p.slug}`}
                        className="search-result"
                        onClick={close}
                      >
                        <span className="search-result__title">{p.title}</span>
                        <span className="search-result__meta">
                          {p.date}{p.category ? ` · ${p.category}` : ""}
                        </span>
                        {p.summary && (
                          <span className="search-result__summary">{p.summary}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <p className="search-empty">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                <p className="search-hint">Start typing to search posts…</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
