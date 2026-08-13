import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

/**
 * Minimal page shell for route foundations.
 * Final visual design will replace this in the next development phase.
 */
export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <Container as="section" className="py-12">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? <p className="max-w-2xl text-muted">{description}</p> : null}
      </header>
      {children ?? (
        <p className="text-sm text-muted">
          Content for this page will be rendered from Sanity CMS during the next
          development phase.
        </p>
      )}
    </Container>
  );
}

export default PageShell;
