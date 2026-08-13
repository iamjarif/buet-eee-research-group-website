"use client";

import { useEffect, useRef, useState } from "react";

import { NavLink } from "@/components/navigation/NavLink";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Link, NavItem } from "../../../sanity/types";

type MobileNavProps = {
  navigation: NavItem[];
  headerCta?: Link | null;
  className?: string;
};

export function MobileNav({ navigation, headerCta, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={cn("lg:hidden", className)}>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden className="relative block h-3.5 w-5">
          <span
            className={cn(
              "absolute left-0 top-0 block h-0.5 w-full bg-current transition-transform",
              open && "translate-y-[6px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-[6px] block h-0.5 w-full bg-current transition-opacity",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-3 block h-0.5 w-full bg-current transition-transform",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </span>
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          ref={panelRef}
          className="fixed inset-0 top-[var(--layout-header-height)] z-50 bg-surface-base"
        >
          <nav aria-label="Mobile navigation" className="px-5 py-8">
            <ul className="space-y-6">
              {navigation.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <NavLink
                    item={item}
                    className="text-body-md text-text-secondary"
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>

            {headerCta?.href ? (
              <div className="mt-8">
                <LinkButton
                  href={headerCta.href}
                  external={headerCta.openInNewTab}
                  onClick={() => setOpen(false)}
                >
                  {headerCta.label}
                  {!headerCta.label.includes("→") ? " →" : ""}
                </LinkButton>
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

export default MobileNav;
