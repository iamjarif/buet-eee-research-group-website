import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

type LinkAnnotation = {
  href?: string;
  openInNewTab?: boolean;
};

const linkClassName = cn(
  "text-brand-primary underline decoration-1 underline-offset-2 transition-opacity duration-300",
  hoverEaseClass,
  "hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-body-md text-text-secondary">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const { href, openInNewTab } = (value ?? {}) as LinkAnnotation;
      if (!href) return <>{children}</>;

      if (href.startsWith("/")) {
        return (
          <Link href={href} className={linkClassName}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={linkClassName}
          rel="noopener noreferrer"
          {...(openInNewTab ? { target: "_blank" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

type PortableTextContentProps = {
  value?: PortableTextBlock[] | null;
  className?: string;
};

export function PortableTextContent({ value, className }: PortableTextContentProps) {
  if (!value?.length) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}

export default PortableTextContent;
