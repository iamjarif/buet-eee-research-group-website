"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { NavLink } from "@/components/navigation/NavLink";
import { Stagger, StaggerItem, StaggerList, StaggerListItem } from "@/components/motion/Stagger";
import { LinkButton } from "@/components/ui/Button";
import { transitionUI } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { Link, NavItem } from "../../../sanity/types";

type MobileNavProps = {
  navigation: NavItem[];
  headerCta?: Link | null;
  className?: string;
};

export function MobileNav({ navigation, headerCta, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((current) => !current);
  }, []);

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

  const panel = mounted ? (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-navigation-panel"
          id="mobile-navigation"
          ref={panelRef}
          className="fixed inset-0 top-[var(--layout-header-height)] z-[100] flex flex-col overflow-hidden bg-surface-base"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : transitionUI}
        >
          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-8"
          >
            <StaggerList immediate className="space-y-6" stagger={0.08}>
              {navigation.map((item) => (
                <StaggerListItem key={`${item.href}-${item.label}`}>
                  <NavLink
                    item={item}
                    className="text-body-md"
                    onNavigate={() => setOpen(false)}
                  />
                </StaggerListItem>
              ))}
            </StaggerList>

            {headerCta?.href ? (
              <Stagger immediate className="mt-8" stagger={0.08}>
                <StaggerItem>
                  <LinkButton
                    href={headerCta.href}
                    external={headerCta.openInNewTab}
                    onClick={() => setOpen(false)}
                  >
                    {headerCta.label}
                    {!headerCta.label.includes("→") ? " →" : ""}
                  </LinkButton>
                </StaggerItem>
              </Stagger>
            ) : null}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  ) : null;

  return (
    <div className={cn("relative z-[110] lg:hidden", className)}>
      <button
        type="button"
        data-lenis-prevent
        className="inline-flex h-10 w-10 touch-manipulation items-center justify-center text-text-primary transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={toggleMenu}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden className="relative block h-3.5 w-5">
          <span
            className={cn(
              "absolute left-0 top-0 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "translate-y-[6px] rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-[6px] block h-0.5 w-full bg-current transition-opacity duration-300",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-3 block h-0.5 w-full bg-current transition-transform duration-300",
              open && "-translate-y-[6px] -rotate-45",
            )}
          />
        </span>
      </button>

      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}

export default MobileNav;
