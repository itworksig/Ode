import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toc from "@/components/Toc";
import ShareButton from "@/components/ShareButton";
import TranslationBanner from "@/components/TranslationBanner";
import SponsorButton from "@/components/SponsorButton";
import DisqusComments from "@/components/DisqusComments";
import CodeBlock from "@/components/mdx/CodeBlock";
import { getAllPosts, getPostBySlug, getTranslations, getAvailableLangs, toSlug } from "@/lib/posts";
import { extractToc } from "@/lib/toc";
import { getMessages, isValidLocale, isRtl, locales, type Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/config";
import { getNavLinks } from "@/lib/nav";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import { preprocessAdmonitions } from "@/lib/mdx-admonitions";
import { Note, Info, Warning, Danger, Tip, Stale } from "@/components/mdx/Admonition";
import { MdxImage } from "@/components/mdx/MdxImage";
import { MarkdownImage } from "@/components/mdx/MarkdownImage";

type PageProps = {
  params: Promise<{ locale: string; year: string; slug: string; lang: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts().flatMap((post) =>
      getAvailableLangs(post.year, post.slug)
        .filter((l) => l !== "en")
        .map((lang) => ({ locale, year: post.year, slug: post.slug, lang }))
    )
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, year, slug, lang } = await params;
  const post = getPostBySlug(year, slug, lang);
  if (!post) return { title: "Not Found" };
  const { site } = getSiteConfig();
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${site.url}/${locale}/blog/${year}/${slug}/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}

const mdxComponents = {
  Note, Info, Warning, Danger, Tip, Stale, MdxImage,
  pre: CodeBlock,
  img: MarkdownImage,
};

const mdxOptions = {
  remarkPlugins: [remarkGfm, remarkMath] as never[],
  rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeKatex] as never[],
};

export default async function TranslationPostPage({ params }: PageProps) {
  const { locale, year, slug, lang } = await params;
  if (!isValidLocale(locale)) redirect("/en");

  const t = getMessages(locale as Locale);
  const cfg = getSiteConfig();
  const post = getPostBySlug(year, slug, lang);
  if (!post) notFound();

  const translations = getTranslations(year, slug, lang);
  const processedContent = preprocessAdmonitions(post.content);
  const tocEntries = extractToc(post.content);
  const navLinks = getNavLinks(locale, t);

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />
      <main className="post-frame">
        <article className="post-shell" dir={isRtl(post.lang ?? "en") ? "rtl" : undefined}>
          <header className="post-header">
            {post.eyebrow && <p className="eyebrow">{post.eyebrow}</p>}
            <h1>{post.title}</h1>
            {post.summary && <p className="post-summary">{post.summary}</p>}
            <div className="meta-row">
              <span>{formatDate(post.date)}</span>
              {post.category && <span>{post.category}</span>}
              {post.readingTime && <span>{post.readingTime}</span>}
            </div>
          </header>

          <TranslationBanner translations={translations} locale={locale} />

          <div className="post-body mdx-body">
            <MDXRemote
              source={processedContent}
              components={mdxComponents}
              options={{ mdxOptions }}
            />
          </div>

          <footer className="post-footer">
            <div className="post-footer__actions">
              <ShareButton title={post.title} />
              {cfg.sponsor.enabled && cfg.sponsor.url && (
                <SponsorButton label={cfg.sponsor.label} url={cfg.sponsor.url} />
              )}
            </div>
            {post.category && (
              <div className="post-footer__meta">
                <span className="post-footer__label">Category</span>
                <Link href={`/${locale}/categories/${toSlug(post.category)}`} className="post-meta-chip post-meta-chip--category">
                  {post.category}
                </Link>
              </div>
            )}
            {post.tags.length > 0 && (
              <div className="post-footer__meta">
                <span className="post-footer__label">Tags</span>
                <div className="post-meta-chips">
                  {post.tags.map((tag) => (
                    <Link key={tag} href={`/${locale}/tags/${toSlug(tag)}`} className="post-meta-chip">{tag}</Link>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </article>

        <Toc entries={tocEntries} />
      </main>

      {cfg.disqus.shortname && (
        <DisqusComments
          shortname={cfg.disqus.shortname}
          pageUrl={`${cfg.site.url}/${locale}/blog/${year}/${slug}/${lang}`}
          pageIdentifier={`${year}/${slug}/${lang}`}
        />
      )}
      <Footer locale={locale as Locale} />
    </div>
  );
}
