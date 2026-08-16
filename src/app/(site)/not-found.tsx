import Link from "next/link";

import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container as="section" className="py-24 text-center">
      <Stagger immediate className="flex flex-col items-center" stagger={0.08}>
        <StaggerItem>
          <h1 className="text-display-sm text-text-primary">Page not found</h1>
        </StaggerItem>
        <StaggerItem className="mt-4 max-w-xl">
          <p className="text-body-md text-text-secondary">
            The page you are looking for does not exist or may have been moved.
          </p>
        </StaggerItem>
        <StaggerItem className="mt-8">
          <Link
            href="/"
            className="text-label-md text-text-primary underline underline-offset-4 transition-opacity duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            Return to homepage
          </Link>
        </StaggerItem>
      </Stagger>
    </Container>
  );
}
