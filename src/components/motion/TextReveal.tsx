"use client";

import { motion, useReducedMotion } from "motion/react";

import { STAGGER } from "@/lib/motion/constants";
import { createStaggerContainer, fadeUpHero } from "@/lib/motion/variants";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  id?: string;
  /** When true, animates on mount (hero) instead of in-viewport */
  immediate?: boolean;
  lineClassName?: string;
};

const motionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
};

export function TextReveal({
  text,
  as: Tag = "h1",
  className,
  id,
  immediate = false,
  lineClassName,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const lines = text.split("\n").filter(Boolean);
  const MotionTag = motionTags[Tag];

  if (reduced) {
    const StaticTag = Tag;
    return (
      <StaticTag id={id} className={className}>
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className={lineClassName ?? "block"}>
            {line}
          </span>
        ))}
      </StaticTag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : { once: true, amount: 0.3 }}
      variants={createStaggerContainer(STAGGER.hero, 0)}
    >
      {lines.map((line, index) => (
        <motion.span
          key={`${line}-${index}`}
          className={lineClassName ?? "block"}
          variants={fadeUpHero}
        >
          {line}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export default TextReveal;
