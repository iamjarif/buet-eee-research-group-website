import { Container } from "@/components/ui/Container";
import { LoadingRoot, SkeletonBlock } from "@/components/ui/skeleton/primitives";

export function PageShellLoading() {
  return (
    <LoadingRoot className="mt-0 bg-surface-base">
      <Container as="section" className="py-12">
        <header className="mb-8 flex flex-col gap-4">
          <SkeletonBlock className="h-10 max-w-[24rem] w-full" />
        </header>
      </Container>
    </LoadingRoot>
  );
}

export default PageShellLoading;
