import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  LoadingRoot,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function NewsEntrySkeleton() {
  return (
    <div
      aria-hidden
      className="grid items-start gap-8 border-b border-border-default py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-12 lg:py-14 xl:gap-x-16"
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-baseline gap-3.5">
          <SkeletonBlock className="h-3 w-[6.5rem]" />
          <SkeletonBlock className="h-3 w-[4.5rem]" />
        </div>
        <SkeletonBlock className="h-7 max-w-[36rem] w-full" />
        <div className="max-w-[38rem] space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 max-w-[28rem] w-full" />
        </div>
      </div>
      <SkeletonBlock className="aspect-[4/3] w-full max-w-[26rem] lg:col-start-2 lg:max-w-none" />
    </div>
  );
}

export function ActivitiesLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton className="pb-8" />

      <section className="bg-surface-base pb-[120px] pt-8">
        <Container as="div">
          {[0, 1, 2].map((index) => (
            <NewsEntrySkeleton key={index} />
          ))}
        </Container>
      </section>
    </LoadingRoot>
  );
}

export default ActivitiesLoading;
