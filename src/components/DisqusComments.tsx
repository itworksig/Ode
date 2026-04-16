"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: { reset: (opts: { reload: boolean; config: () => void }) => void };
  }
}

type Props = {
  shortname: string;
  pageUrl: string;
  pageIdentifier: string;
};

export default function DisqusComments({ shortname, pageUrl, pageIdentifier }: Props) {
  useEffect(() => {
    if (!shortname) return;

    window.disqus_config = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).page.url = pageUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).page.identifier = pageIdentifier;
    };

    if (window.DISQUS) {
      window.DISQUS.reset({ reload: true, config: window.disqus_config });
    } else {
      const script = document.createElement("script");
      script.src = `https://${shortname}.disqus.com/embed.js`;
      script.async = true;
      script.setAttribute("data-timestamp", String(+new Date()));
      (document.head || document.body).appendChild(script);
    }
  }, [shortname, pageUrl, pageIdentifier]);

  if (!shortname) return null;

  return (
    <div className="disqus-container">
      <div id="disqus_thread" />
      <noscript>
        Please enable JavaScript to view{" "}
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus</a>.
      </noscript>
    </div>
  );
}
