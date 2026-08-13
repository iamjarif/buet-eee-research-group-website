import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "article";
};

export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[var(--layout-page-width)] px-5 sm:px-8 lg:px-[var(--spacing-container-x)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export default Container;
