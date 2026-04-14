import type { MDXComponents } from "mdx/types";
import { Note, Info, Warning, Danger, Tip, Stale } from "@/components/mdx/Admonition";
import { MdxImage } from "@/components/mdx/MdxImage";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom admonition components
    Note,
    Info,
    Warning,
    Danger,
    Tip,
    Stale,
    // Image with optional caption
    MdxImage,
    // Override built-in img tag to use our styled component
    img: ({ src, alt }) => <MdxImage src={src ?? ""} alt={alt} />,
    ...components,
  };
}
