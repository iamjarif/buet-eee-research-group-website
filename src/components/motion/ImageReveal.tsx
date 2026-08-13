"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

import { VIEWPORT } from "@/lib/motion/constants";
import { imageReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  parallax?: boolean;
  parallaxOffset?: number;
};

export function ImageReveal({
  children,
  className,
  parallax = false,
  parallaxOffset = 15,
}: ImageRevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced || !parallax ? [0, 0] : [-parallaxOffset / 2, parallaxOffset / 2],
  );

  if (reduced) {
    return <div className={cn("relative overflow-hidden", className)}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="relative h-full w-full"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={imageReveal}
        style={parallax ? { y } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default ImageReveal;
