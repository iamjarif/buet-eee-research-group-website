import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-sm bg-surface-subtle", className)} />;
}

type LoadingRootProps = {
  children: ReactNode;
  className?: string;
};

export function LoadingRoot({ children, className }: LoadingRootProps) {
  return (
    <div
      className={cn(
        "-mt-[var(--layout-header-height)] min-h-[calc(100dvh-var(--layout-header-height))] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading page content</span>
      {children}
    </div>
  );
}

type CatalogPageHeaderSkeletonProps = {
  withBorder?: boolean;
  className?: string;
};

export function CatalogPageHeaderSkeleton({
  withBorder = false,
  className,
}: CatalogPageHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface-base pt-[140px] pb-10",
        withBorder && "border-b border-border-default pb-12",
        className,
      )}
    >
      <Container as="div" className="flex flex-col gap-7">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-3 w-[4.5rem]" />
          <span aria-hidden className="h-px flex-1 bg-border-default" />
          <SkeletonBlock className="h-3 w-[3.5rem]" />
        </div>

        <div className="space-y-3.5">
          <SkeletonBlock className="h-[3.25rem] max-w-[34rem] w-full" />
          <SkeletonBlock className="h-[3.25rem] max-w-[22rem] w-full" />
        </div>

        <div className="space-y-2.5">
          <SkeletonBlock className="h-4 max-w-[28rem] w-full" />
          <SkeletonBlock className="h-4 max-w-[24rem] w-full" />
        </div>
      </Container>
    </div>
  );
}

export function FilterBarSkeleton({ pillCount = 3 }: { pillCount?: number }) {
  return (
    <div className="border-t border-border-default bg-surface-subtle py-4">
      <Container as="div">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SkeletonBlock className="h-9 w-full max-w-[360px]" />
          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: pillCount }).map((_, index) => (
              <SkeletonBlock key={index} className="h-8 w-[5.5rem]" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export function IdentityBarSkeleton() {
  return (
    <div className="border-b border-border-default bg-surface-subtle py-8">
      <Container as="div">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="space-y-2.5">
            <SkeletonBlock className="h-7 w-[14rem]" />
            <SkeletonBlock className="h-4 w-[18rem]" />
            <SkeletonBlock className="h-4 w-[22rem]" />
          </div>
          <div className="space-y-2.5">
            <SkeletonBlock className="h-4 w-[12rem]" />
            <SkeletonBlock className="h-4 w-[10rem]" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export function SectionRuleSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <SkeletonBlock className="h-3 w-[2.5rem]" />
      <span aria-hidden className="h-px flex-1 bg-border-default" />
      <SkeletonBlock className="h-3 w-[5rem]" />
    </div>
  );
}
