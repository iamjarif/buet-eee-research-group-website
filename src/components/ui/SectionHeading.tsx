import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionHeadingProps) {
  return (
    <header className={cn("space-y-2", className)}>
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-section-title text-foreground">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base text-muted">{description}</p>
      ) : null}
      {children}
    </header>
  );
}

export default SectionHeading;
