"use client";

import { useState, useRef, Children, isValidElement } from "react";
import dynamic from "next/dynamic";

const Mermaid = dynamic(() => import("./Mermaid"), { ssr: false });

type PreProps = React.HTMLAttributes<HTMLPreElement>;

export default function CodeBlock({ children, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  // Detect mermaid blocks: <pre><code class="language-mermaid">...</code></pre>
  const child = Children.toArray(children)[0];
  if (isValidElement<{ className?: string; children?: string }>(child)) {
    if (child.props.className?.includes("language-mermaid")) {
      return <Mermaid chart={child.props.children ?? ""} />;
    }
  }

  async function copy() {
    const text = ref.current?.innerText ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="code-block">
      <pre ref={ref} {...props}>
        {children}
      </pre>
      <button
        className="code-block__copy"
        onClick={copy}
        aria-label="Copy code"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}
