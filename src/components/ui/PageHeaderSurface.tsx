import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function PageHeaderSurface({ children, className }: PageHeaderSurfaceProps) {
  return (
    <header
      className={cn(
        "page-header-padding bg-surface-inverse text-text-inverse",
        className,
      )}
    >
      {children}
    </header>
  );
}

export const pageHeaderTitleClassName = "text-display-lg text-text-inverse";

export const pageHeaderDescriptionClassName = "text-body-md text-text-inverse-secondary";

export default PageHeaderSurface;
