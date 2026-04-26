"use client";

import { useEffect, useState } from "react";

type Props = { chart: string };

export default function Mermaid({ chart }: Props) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#ebdbb2",
          primaryTextColor: "#282828",
          primaryBorderColor: "#bdae93",
          lineColor: "#665c54",
          secondaryColor: "#f2e5bc",
          tertiaryColor: "#f9f5d7",
          fontSize: "14px",
          // fontFamily intentionally omitted — Mermaid must use the same font
          // for both text measurement and rendering, or nodes will be undersized.
        },
      });

      mermaid
        .render(id, chart.trim())
        .then(({ svg: rendered }) => {
          if (!cancelled) setSvg(rendered);
        })
        .catch((e) => {
          if (!cancelled) setError(String(e));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="mermaid-error">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return <div className="mermaid-loading">Loading diagram…</div>;
  }

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
