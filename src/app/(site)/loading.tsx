import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container as="section" className="py-24" aria-live="polite" aria-busy="true">
      <p className="text-muted">Loading…</p>
    </Container>
  );
}
