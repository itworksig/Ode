import { getSiteConfig } from "@/lib/config";
import { getMessages, type Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const cfg = getSiteConfig();
  const t = getMessages(locale);
  return (
    <footer className="site-footer">
      <p>{t.footer.text}</p>
      <p className="footer-meta">
        {t.footer.served} <code>{cfg.footer.version}</code>,{" "}
        {t.footer.source}{" "}
        <a href={cfg.footer.github}>here</a>.
      </p>
    </footer>
  );
}
