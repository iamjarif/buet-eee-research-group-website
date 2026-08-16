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
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setArmed(false);

    const timer = window.setTimeout(() => {
      setArmed(true);
    }, 480);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (reduced) {
    return children;
  }

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
