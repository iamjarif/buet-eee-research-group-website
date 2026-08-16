"use client";

import { motion, useReducedMotion } from "motion/react";

import { VIEWPORT, type ViewportConfig } from "@/lib/motion/constants";
import { transitionUI } from "@/lib/motion/transitions";
import { lineReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type RuleRevealProps = {
  className?: string;
  delay?: number;
  viewport?: ViewportConfig;
};

/** A hairline that draws itself from the left as it enters the viewport. */
export function RuleReveal({
  className,
  delay = 0,
  viewport = VIEWPORT,
}: RuleRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <span aria-hidden className={cn("block h-px bg-border-default", className)} />
    );
  }

  return (
    <motion.span
      aria-hidden
      className={cn("block h-px origin-left bg-border-default", className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={lineReveal}
      transition={{ ...transitionUI, delay }}
    />
  );
}

export default RuleReveal;
