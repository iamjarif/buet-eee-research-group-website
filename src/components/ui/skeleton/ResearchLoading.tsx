import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  LoadingRoot,
  SectionRuleSkeleton,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function ResearchAreaSkeleton() {
  return (
    <div aria-hidden>
      <SectionRuleSkeleton />

      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-x-16">
        <div className="flex flex-col items-start gap-5">
          <SkeletonBlock className="h-9 max-w-[18rem] w-full" />
          <div className="w-full max-w-[28rem] space-y-2">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 max-w-[20rem] w-full" />
          </div>
          <SkeletonBlock className="h-4 w-[6rem]" />
        </div>

        <div className="flex flex-col gap-8">
          <SkeletonBlock className="aspect-[4/3] max-w-[34rem] w-full" />
          <div className="max-w-[34rem] border-t border-border-default">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="space-y-2 border-b border-border-default py-4"
              >
                <SkeletonBlock className="h-4 max-w-[24rem] w-full" />
                <SkeletonBlock className="h-3 w-[10rem]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResearchLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton />

      <div className="bg-surface-base page-content-padding">
        <Container as="div" className="space-y-10 lg:space-y-14">
          {[0, 1].map((index) => (
            <ResearchAreaSkeleton key={index} />
          ))}
        </Container>
      </div>
    </LoadingRoot>
  );
}

export default ResearchLoading;
