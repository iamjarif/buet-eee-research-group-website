import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  LoadingRoot,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function NewsFilterBarSkeleton() {
  return (
    <div className="border-t border-border-default bg-surface-subtle py-4">
      <Container as="div">
        <div className="flex flex-wrap items-center gap-2">
          {[0, 1, 2, 3].map((index) => (
            <SkeletonBlock key={index} className="h-8 w-[5.5rem]" />
          ))}
        </div>
      </Container>
    </div>
  );
}

function NewsEntrySkeleton() {
  return (
    <div
      aria-hidden
      className="grid items-start gap-5 border-b border-border-default py-7 sm:gap-8 sm:py-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-x-12 lg:py-14 xl:gap-x-16"
    >
      <SkeletonBlock className="aspect-[4/3] w-full max-w-[26rem] lg:max-w-none" />

      <div className="flex min-w-0 flex-col gap-3 sm:gap-5">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <SkeletonBlock className="h-3 w-[6.5rem]" />
          <SkeletonBlock className="h-3 w-[4.5rem]" />
        </div>
        <SkeletonBlock className="h-7 max-w-[36rem] w-full" />
        <div className="max-w-[38rem] space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 max-w-[28rem] w-full" />
        </div>
      </div>
    </div>
  );
}

export function ActivitiesLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton />

      <NewsFilterBarSkeleton />

      <section className="bg-surface-base page-content-padding">
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
