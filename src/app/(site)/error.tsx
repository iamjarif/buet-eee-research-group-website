"use client";

import { useEffect } from "react";

import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container as="section" className="py-24 text-center">
      <Stagger immediate className="flex flex-col items-center" stagger={0.08}>
        <StaggerItem>
          <h1 className="text-display-sm text-text-primary">Something went wrong</h1>
        </StaggerItem>
        <StaggerItem className="mt-4 max-w-xl">
          <p className="text-body-md text-text-secondary">
            An unexpected error occurred. Please try again or contact the site
            administrator.
          </p>
        </StaggerItem>
        <StaggerItem className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </StaggerItem>
      </Stagger>
    </Container>
  );
}
