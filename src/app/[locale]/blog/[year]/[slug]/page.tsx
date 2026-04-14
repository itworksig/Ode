import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Header from "@/components/Header";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getMessages, isValidLocale, locales, type Locale } from "@/lib/i18n";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { preprocessAdmonitions } from "@/lib/mdx-admonitions";
import { Note, Info, Warning, Danger, Tip, Stale } from "@/components/mdx/Admonition";
import { MdxImage } from "@/components/mdx/MdxImage";

type PageProps = {
  params: Promise<{ locale: string; year: string; slug: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, year: post.year, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, slug } = await params;
  const post = getPostBySlug(year, slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.summary };
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
}

const mdxComponents = {
  Note,
  Info,
  Warning,
  Danger,
  Tip,
  Stale,
  MdxImage,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <MdxImage src={src ?? ""} alt={alt} />
  ),
};

export default async function LocalePostPage({ params }: PageProps) {
  const { locale, year, slug } = await params;
  if (!isValidLocale(locale)) redirect("/en");

  const t = getMessages(locale as Locale);
  const post = getPostBySlug(year, slug);
  if (!post) notFound();

  const processedContent = preprocessAdmonitions(post.content);

  const navLinks = [
    { href: `/${locale}/blog`, label: t.nav.archive },
    { href: `/${locale}`, label: t.nav.home },
  ];

  return (
    <div className="site-shell">
      <Header links={navLinks} locale={locale as Locale} />

      <main className="page-frame">
        <article className="post-shell">
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

          <div className="post-body mdx-body">
            <MDXRemote
              source={processedContent}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeHighlight],
                },
              }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
