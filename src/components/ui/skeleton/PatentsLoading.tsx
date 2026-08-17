import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  LoadingRoot,
  SectionRuleSkeleton,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function PatentRowSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col gap-4 border-b border-border-default py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
    >
      <div className="flex min-w-0 flex-1 items-start gap-8 sm:items-center">
        <SkeletonBlock className="h-3 w-6 shrink-0" />
        <SkeletonBlock className="h-7 max-w-[32rem] w-full flex-1" />
      </div>
      <SkeletonBlock className="h-4 w-[5.5rem] shrink-0" />
    </div>
  );
}

function PatentCardSkeleton() {
  return (
    <div
      aria-hidden
      className="space-y-4 border border-border-default bg-surface-base p-6"
    >
      <SkeletonBlock className="h-3 w-[4rem]" />
      <SkeletonBlock className="h-7 max-w-[18rem] w-full" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 max-w-[12rem] w-full" />
    </div>
  );
}

export function PatentsLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton />

      <section className="bg-surface-base page-content-padding">
        <Container as="div">
          {[0, 1, 2, 3].map((index) => (
            <PatentRowSkeleton key={index} />
          ))}
        </Container>
      </section>

      <section className="bg-surface-subtle py-24">
        <Container as="div" className="flex flex-col gap-12">
          <SectionRuleSkeleton />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <PatentCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </section>
    </LoadingRoot>
  );
}

export default PatentsLoading;
