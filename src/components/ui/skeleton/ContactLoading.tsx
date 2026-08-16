import { Container } from "@/components/ui/Container";
import {
  CatalogPageHeaderSkeleton,
  IdentityBarSkeleton,
  LoadingRoot,
  SkeletonBlock,
} from "@/components/ui/skeleton/primitives";

function ContactFormSkeleton() {
  return (
    <div aria-hidden className="max-w-[34rem] space-y-8">
      <SkeletonBlock className="h-3 w-[4.5rem]" />
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="space-y-2.5">
          <SkeletonBlock className="h-3 w-[5rem]" />
          <SkeletonBlock className="h-11 w-full" />
        </div>
      ))}
      <SkeletonBlock className="h-10 w-[8rem]" />
    </div>
  );
}

function ContactLocationSkeleton() {
  return (
    <div aria-hidden className="space-y-8">
      <div className="space-y-3">
        <SkeletonBlock className="h-3 w-[4rem]" />
        <SkeletonBlock className="h-4 w-[14rem]" />
        <SkeletonBlock className="h-4 w-[12rem]" />
      </div>
      <SkeletonBlock className="aspect-[4/3] w-full" />
    </div>
  );
}

export function ContactLoading() {
  return (
    <LoadingRoot>
      <CatalogPageHeaderSkeleton />
      <IdentityBarSkeleton />

      <section className="bg-surface-base pb-20 pt-14 lg:pb-24 lg:pt-16">
        <Container as="div">
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-x-20 xl:gap-x-24">
            <ContactFormSkeleton />
            <ContactLocationSkeleton />
          </div>
        </Container>
      </section>
    </LoadingRoot>
  );
}

export default ContactLoading;
