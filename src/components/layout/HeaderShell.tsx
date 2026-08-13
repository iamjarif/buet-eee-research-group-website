"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type HeaderShellProps = {
  children: ReactNode;
};

export function HeaderShell({ children }: HeaderShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const lenis = useLenis();
  const [isAtTop, setIsAtTop] = useState(true);
  const isTransparent = isHomePage && isAtTop;

  useEffect(() => {
    if (!isHomePage) return;

    const updateScrollState = () => {
      setIsAtTop((lenis?.scroll ?? window.scrollY) <= 0);
    };

    updateScrollState();

    if (lenis) {
      lenis.on("scroll", updateScrollState);
      return () => lenis.off("scroll", updateScrollState);
    }

    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, [isHomePage, lenis]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-300 ease-in-out",
        isTransparent ? "bg-transparent" : "bg-surface-base/95 backdrop-blur-sm",
      )}
    >
      {children}
    </header>
  );
}

export default HeaderShell;
