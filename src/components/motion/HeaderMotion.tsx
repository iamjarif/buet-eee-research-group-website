"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { STAGGER } from "@/lib/motion/constants";
import { createStaggerContainer, headerItem } from "@/lib/motion/variants";

type HeaderMotionProps = {
  children: ReactNode;
  className?: string;
};

export function HeaderMotion({ children, className }: HeaderMotionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={createStaggerContainer(STAGGER.tight, 0.1)}
    >
      {children}
    </motion.div>
  );
}

type HeaderMotionItemProps = {
  children: ReactNode;
  className?: string;
};

export function HeaderMotionItem({ children, className }: HeaderMotionItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={headerItem}>
      {children}
    </motion.div>
  );
}

export default HeaderMotion;
