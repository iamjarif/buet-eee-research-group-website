"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { transitionUI } from "@/lib/motion/transitions";
import { VIEWPORT } from "@/lib/motion/constants";
import { fadeUpSubtle, lineReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type ResearchRowMotionProps = {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
};

export function ResearchRowMotion({
  children,
  className,
  isLast = false,
}: ResearchRowMotionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div
        className={cn(
          "flex flex-col gap-6 border-t border-border-default py-8 lg:flex-row lg:items-center lg:justify-between",
          isLast && "border-b",
          className,
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "group relative flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={fadeUpSubtle}
    >
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left bg-border-default"
        variants={lineReveal}
        transition={transitionUI}
      />
      {isLast ? (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-border-default"
          variants={lineReveal}
          transition={{ ...transitionUI, delay: 0.08 }}
        />
      ) : null}
      {children}
    </motion.div>
  );
}

type ResearchTitleMotionProps = {
  children: ReactNode;
};

export function ResearchTitleMotion({ children }: ResearchTitleMotionProps) {
  return (
    <span
      className={cn(
        "inline-block transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/link:translate-x-1",
      )}
    >
      {children}
    </span>
  );
}

export default ResearchRowMotion;
