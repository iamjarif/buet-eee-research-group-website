import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  LoadingRoot,
  SectionRuleSkeleton,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function PIFeatureSkeleton() {
  return (
    <div
      aria-hidden
      className="grid gap-6 sm:gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-x-20 xl:gap-x-24"
    >
      <SkeletonBlock className="aspect-[4/5] w-full max-w-[13.5rem] sm:max-w-[19rem]" />
      <div className="space-y-7">
        <div className="space-y-3">
          <SkeletonBlock className="h-3 w-[4rem]" />
          <SkeletonBlock className="h-10 max-w-[20rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[16rem] w-full" />
        </div>
        <div className="max-w-[36rem] space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 max-w-[28rem] w-full" />
        </div>
      </div>
    </div>
  );
}

function PeopleGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} aria-hidden className="space-y-4">
          <SkeletonBlock className="aspect-[4/5] w-full" />
          <SkeletonBlock className="h-5 max-w-[10rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[8rem] w-full" />
        </div>
      ))}
    </div>
  );
}

export function PeopleLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton />

      <section className="bg-surface-base py-8 sm:py-14 lg:py-16">
        <Container as="div">
          <PIFeatureSkeleton />
        </Container>
      </section>

      <section className="bg-surface-base py-10 sm:py-14 lg:py-16">
        <Container as="div" className="space-y-6 sm:space-y-10 lg:space-y-12">
          <SectionRuleSkeleton />
          <PeopleGridSkeleton />
        </Container>
      </section>

      <section className="bg-surface-base py-10 pb-16 sm:py-14 sm:pb-[120px] lg:py-16">
        <Container as="div" className="space-y-6 sm:space-y-10 lg:space-y-12">
          <SectionRuleSkeleton />
          <PeopleGridSkeleton />
        </Container>
      </section>
    </LoadingRoot>
  );
}

export default PeopleLoading;
