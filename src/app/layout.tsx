import type { Metadata } from "next";
import "@fontsource/iosevka-aile/400.css";
import "@fontsource/iosevka-aile/700.css";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource/podkova/700.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/config";

export async function generateMetadata(): Promise<Metadata> {
  const cfg = getSiteConfig();
  let metadataBase: URL;
  try {
    metadataBase = new URL(cfg.site.url);
  } catch {
    metadataBase = new URL("http://localhost:3000");
  }
  return {
    metadataBase,
    title: {
      default: cfg.site.name,
      template: `%s | ${cfg.site.name}`,
    },
    description: cfg.site.description || cfg.site.subtitle,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
