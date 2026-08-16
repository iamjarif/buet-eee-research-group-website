import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  FilterBarSkeleton,
  LoadingRoot,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function PublicationRowSkeleton() {
  return (
    <div
      aria-hidden
      className="flex items-start justify-between gap-6 border-b border-border-default py-7"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-8 sm:flex-row sm:gap-12">
        <SkeletonBlock className="h-3 w-[4.5rem] shrink-0" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <SkeletonBlock className="h-7 max-w-[36rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[24rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[18rem] w-full" />
        </div>
      </div>
      <SkeletonBlock className="hidden h-4 w-[3rem] shrink-0 sm:block" />
    </div>
  );
}

export function PublicationsLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton withBorder />
      <FilterBarSkeleton pillCount={3} />

      <div className="bg-surface-base pb-[120px] pt-10">
        <Container as="div">
          <SkeletonBlock className="mb-8 h-8 w-[5rem]" />
          {[0, 1, 2, 3].map((index) => (
            <PublicationRowSkeleton key={index} />
          ))}
        </Container>
      </div>
    </LoadingRoot>
  );
}

export default PublicationsLoading;
