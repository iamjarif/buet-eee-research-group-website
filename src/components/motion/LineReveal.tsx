"use client";

import { motion, useReducedMotion } from "motion/react";

import { transitionUI } from "@/lib/motion/transitions";
import { VIEWPORT } from "@/lib/motion/constants";
import { lineReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type LineRevealProps = {
  className?: string;
  origin?: "left" | "right" | "center";
};

export function LineReveal({ className, origin = "left" }: LineRevealProps) {
  const reduced = useReducedMotion();

  const originClass =
    origin === "right"
      ? "origin-right"
      : origin === "center"
        ? "origin-center"
        : "origin-left";

  if (reduced) {
    return <div aria-hidden className={cn(className, originClass)} />;
  }

  return (
    <motion.div
      aria-hidden
      className={cn(className, originClass)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={lineReveal}
      transition={transitionUI}
    />
  );
}

export default LineReveal;
