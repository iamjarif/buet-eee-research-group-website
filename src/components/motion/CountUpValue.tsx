"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

import { parseCountValue, formatCountValue } from "@/lib/motion/count-up";
import { VIEWPORT } from "@/lib/motion/constants";
import { fadeUpSubtle } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

type CountUpValueProps = {
  value: string;
  className?: string;
};

export function CountUpValue({ value, className }: CountUpValueProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, VIEWPORT);
  const parsed = parseCountValue(value);
  const count = useMotionValue(0);
  const display = useTransform(count, (current) =>
    parsed ? formatCountValue(parsed, current) : value,
  );

  useEffect(() => {
    if (!parsed || reduced || !isInView) return;

    const controls = animate(count, parsed.target, {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    });

    return () => controls.stop();
  }, [count, isInView, parsed, reduced]);

  if (!parsed || reduced) {
    return (
      <p ref={ref} className={className}>
        {value}
      </p>
    );
  }

  return (
    <motion.p
      ref={ref}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={fadeUpSubtle}
    >
      <motion.span>{display}</motion.span>
    </motion.p>
  );
}

export default CountUpValue;
