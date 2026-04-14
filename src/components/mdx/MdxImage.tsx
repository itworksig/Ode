type MdxImageProps = {
  src: string;
  alt?: string;
  caption?: string;
};

export function MdxImage({ src, alt = "", caption }: MdxImageProps) {
  return (
    <figure className="mdx-figure">
      <img src={src} alt={alt} className="mdx-img" loading="lazy" />
      {caption && <figcaption className="mdx-figcaption">{caption}</figcaption>}
    </figure>
  );
}
