import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { cn } from "@/lib/utils";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-body-md text-text-secondary">{children}</p>
    ),
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
