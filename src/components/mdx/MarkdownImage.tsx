type MarkdownImageProps = {
  src?: string;
  alt?: string;
};

export function MarkdownImage({ src = "", alt = "" }: MarkdownImageProps) {
  return <img src={src} alt={alt} className="mdx-img" loading="lazy" />;
}
