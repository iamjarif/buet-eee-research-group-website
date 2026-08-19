import type { ReactNode } from "react";

import { HeroHoneycombSkeleton } from "@/components/home/HeroHoneycomb";
import { Container } from "@/components/ui/Container";
import { LoadingRoot, SkeletonBlock } from "@/components/ui/skeleton/primitives";

function HomeSectionSkeleton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <Container as="div">{children}</Container>
    </section>
  );
}

export function HomeLoading() {
  return (
    <LoadingRoot className="bg-surface-base">
      <section className="relative overflow-hidden bg-surface-base">
        <div className="relative min-h-[min(640px,85vh)] sm:min-h-[min(760px,88vh)] lg:min-h-[min(860px,90vh)]">
          <HeroHoneycombSkeleton />
        </div>
      </section>

      <HomeSectionSkeleton className="border-y border-border-default bg-surface-base py-10">
        <div className="flex gap-6 overflow-hidden">
          {[0, 1, 2].map((index) => (
            <SkeletonBlock key={index} className="h-[7.5rem] w-[18rem] shrink-0" />
          ))}
        </div>
      </HomeSectionSkeleton>

      <HomeSectionSkeleton className="section-padding-y bg-surface-base">
        <div className="mb-12 max-w-[28rem] space-y-3">
          <SkeletonBlock className="h-8 w-[14rem]" />
          <SkeletonBlock className="h-4 w-full" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-4">
              <SkeletonBlock className="aspect-[4/3] w-full" />
              <SkeletonBlock className="h-6 w-[12rem]" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ))}
        </div>
      </HomeSectionSkeleton>

      <HomeSectionSkeleton className="section-padding-y bg-surface-subtle">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
          <div className="space-y-3">
            <SkeletonBlock className="h-8 w-[12rem]" />
            <SkeletonBlock className="h-4 max-w-[24rem] w-full" />
            <SkeletonBlock className="h-4 w-[6rem]" />
          </div>
          <SkeletonBlock className="aspect-[4/3] w-full" />
        </div>
      </HomeSectionSkeleton>

      <HomeSectionSkeleton className="section-padding-y bg-surface-base">
        <SkeletonBlock className="mb-10 h-3 w-[12rem]" />
        <SkeletonBlock className="mb-10 h-8 w-[16rem]" />
        <div className="grid gap-0 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <SkeletonBlock key={index} className="h-[251px] w-full border border-border-strong" />
          ))}
        </div>
      </HomeSectionSkeleton>

      <HomeSectionSkeleton className="bg-surface-base pb-24 pt-20">
        <SkeletonBlock className="mb-10 h-8 w-[10rem]" />
        <div className="grid gap-8 lg:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-3 border-t border-border-default pt-6">
              <SkeletonBlock className="h-3 w-[5rem]" />
              <SkeletonBlock className="h-6 max-w-[24rem] w-full" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
          ))}
        </div>
      </HomeSectionSkeleton>
    </LoadingRoot>
  );
}

export default HomeLoading;
