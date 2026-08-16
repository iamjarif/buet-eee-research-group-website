import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <Container as="section" className="py-10 sm:py-12">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8">
        <Reveal immediate variant="fadeUpSubtle">
          <h1 className="min-w-0 text-display-md text-text-primary">{title}</h1>
        </Reveal>
        {description ? (
          <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
            <p className="max-w-2xl text-body-md text-text-secondary">{description}</p>
          </Reveal>
        ) : null}
      </header>

      {children ? (
        <Reveal variant="fadeUpSubtle" delay={0.14}>
          {children}
        </Reveal>
      ) : (
        <Reveal variant="fadeUpSubtle" delay={0.14}>
          <p className="text-body-sm text-text-secondary">
            Content for this page will be rendered from Sanity CMS during the next
            development phase.
          </p>
        </Reveal>
      )}
    </Container>
  );
}

export default PageShell;

