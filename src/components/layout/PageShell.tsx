import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";

type PageShellProps = {
  title: string;
  children?: ReactNode;
};

export function PageShell({ title, children }: PageShellProps) {
  return (
    <Container as="section" className="py-10 sm:py-12">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8">
        <Reveal immediate variant="fadeUpSubtle">
          <h1 className="min-w-0 text-display-md text-text-primary">{title}</h1>
        </Reveal>
      </header>

      {children ? (
        <Reveal variant="fadeUpSubtle" delay={0.14}>
          {children}
        </Reveal>
      ) : null}
    </Container>
  );
}

export default PageShell;

