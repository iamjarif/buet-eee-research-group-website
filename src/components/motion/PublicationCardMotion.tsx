import type { ReactNode } from "react";

import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

type PublicationCardMotionProps = {
  children: ReactNode;
  className?: string;
};

export function PublicationCardMotion({
  children,
  className,
}: PublicationCardMotionProps) {
  return (
    <article
      className={cn(
        "group border-border-default transition-[border-color,box-shadow] duration-300",
        hoverEaseClass,
        "hover:border-border-strong hover:shadow-[0_12px_32px_-20px_rgb(0_0_0_/_0.18)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

type PublicationImageMotionProps = {
  children: ReactNode;
  className?: string;
};

export function PublicationImageMotion({
  children,
  className,
}: PublicationImageMotionProps) {
  return <div className={cn("overflow-hidden", className)}>{children}</div>;
}

export default PublicationCardMotion;
