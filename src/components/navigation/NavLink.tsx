"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";

import { isNavItemActive } from "@/lib/navigation";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { NavItem } from "../../../sanity/types";

type NavLinkProps = {
  item: NavItem;
  className?: string;
  onNavigate?: () => void;
};

const underlineClass = cn(
  "pointer-events-none absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-300",
  hoverEaseClass,
  "group-hover:scale-x-100",
);

export function NavLink({ item, className, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isActive = isNavItemActive(pathname, item.href);
  const isExternal = item.href.startsWith("http") || item.openInNewTab;
  const classes = cn(
    "group relative font-medium transition-[color,opacity] duration-300",
    hoverEaseClass,
    isActive
      ? "text-text-primary"
      : "text-text-secondary hover:text-text-primary",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
    className,
  );

  const content = (
    <>
      {item.label}
      {!reduced ? (
        <span
          aria-hidden
          className={cn(underlineClass, isActive && "scale-x-100")}
        />
      ) : null}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={item.href}
        className={classes}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={classes}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}

export default NavLink;
