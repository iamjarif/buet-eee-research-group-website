"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";

import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

type TextLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  arrow?: boolean;
  external?: boolean;
};

const underlineClass = cn(
  "pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-current transition-transform duration-300",
  hoverEaseClass,
  "group-hover:scale-x-100",
);

const arrowClass = cn(
  "inline-block transition-transform duration-300",
  hoverEaseClass,
  "group-hover:translate-x-1",
);

export function TextLink({
  children,
  className,
  arrow = true,
  external = false,
  href,
  ...props
}: TextLinkProps) {
  const reduced = useReducedMotion();
  const classes = cn(
    "group inline-flex items-center gap-1.5 text-label-xs text-brand-primary transition-[color,opacity] duration-300",
    hoverEaseClass,
    "hover:opacity-80",
    className,
  );

  const content = (
    <>
      <span className="relative">
        {children}
        {!reduced ? <span aria-hidden className={underlineClass} /> : null}
      </span>
      {arrow ? (
        <span aria-hidden className={arrowClass}>
          →
        </span>
      ) : null}
    </>
  );

  if (external || (typeof href === "string" && href.startsWith("http"))) {
    return (
      <a
        href={typeof href === "string" ? href : undefined}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...(props as ComponentPropsWithoutRef<"a">)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

export default TextLink;
