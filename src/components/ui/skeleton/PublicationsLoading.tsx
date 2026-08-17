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
      className="grid items-start gap-8 border-b border-border-default py-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-12 xl:gap-x-16"
    >
      <div className="flex flex-col gap-5">
        <SkeletonBlock className="h-3 w-[4.5rem]" />
        <div className="space-y-2.5">
          <SkeletonBlock className="h-7 max-w-[36rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[24rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[18rem] w-full" />
        </div>
      </div>
      <SkeletonBlock className="aspect-[4/3] w-full max-w-[26rem] lg:col-start-2 lg:max-w-none" />
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
