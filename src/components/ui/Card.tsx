import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "section";
};

export function Card({ children, className, as: Component = "article" }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-lg border border-border bg-background p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </Component>
  );
}

export default Card;
