"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { transitionSection } from "@/lib/motion/transitions";

type FooterShellProps = {
  children: ReactNode;
};

/** Keeps the footer hidden until the current page has mounted and begun its entrance. */
export function FooterShell({ children }: FooterShellProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [armedPath, setArmedPath] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setArmedPath(pathname);
    }, 480);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (reduced) {
    return children;
  }

  const armed = armedPath === pathname;

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: armed ? 1 : 0 }}
      transition={transitionSection}
      className={armed ? undefined : "pointer-events-none"}
      aria-hidden={!armed}
    >
      {children}
    </motion.div>
  );
}

export default FooterShell;
