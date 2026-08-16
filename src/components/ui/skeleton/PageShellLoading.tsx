import { Container } from "@/components/ui/Container";
import { LoadingRoot, SkeletonBlock } from "@/components/ui/skeleton/primitives";

export function PageShellLoading() {
  return (
    <LoadingRoot className="mt-0 bg-surface-base">
      <Container as="section" className="py-12">
        <header className="mb-8 flex flex-col gap-4">
          <SkeletonBlock className="h-10 max-w-[24rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[18rem] w-full" />
        </header>

        <div className="max-w-2xl space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 max-w-[28rem] w-full" />
        </div>
      </Container>
    </LoadingRoot>
  );
}

export default PageShellLoading;
