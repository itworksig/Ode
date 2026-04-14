import type { Metadata } from "next";
import "@fontsource/iosevka-aile/400.css";
import "@fontsource/iosevka-aile/700.css";
import "@fontsource-variable/schibsted-grotesk";
import "@fontsource/podkova/700.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ode.up.railway.app"),
  title: {
    default: "Ode",
    template: "%s | Ode",
  },
  description:
    "Ode is a warm-toned editorial blog scaffolded for Railway deployment.",
};

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
