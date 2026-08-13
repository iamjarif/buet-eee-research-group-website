"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { STAGGER } from "@/lib/motion/constants";
import { createStaggerContainer, fadeUpHero } from "@/lib/motion/variants";

type HeroMotionProps = {
  children: ReactNode;
  className?: string;
};

export function HeroMotion({ children, className }: HeroMotionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={createStaggerContainer(STAGGER.hero, 0.2)}
    >
      {children}
    </motion.div>
  );
}

type HeroMotionItemProps = {
  children: ReactNode;
  className?: string;
};

export function HeroMotionItem({ children, className }: HeroMotionItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUpHero}>
      {children}
    </motion.div>
  );
}

type HeroGridMotionProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function HeroGridMotion({ className, style }: HeroGridMotionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div aria-hidden className={className} style={style} />;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.03 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    />
  );
}

export default HeroMotion;
