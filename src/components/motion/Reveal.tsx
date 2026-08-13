"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { VIEWPORT } from "@/lib/motion/constants";
import { fadeIn, fadeUp, fadeUpSubtle } from "@/lib/motion/variants";

type RevealVariant = "fade" | "fadeUp" | "fadeUpSubtle";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  viewport?: typeof VIEWPORT;
  once?: boolean;
  /** When true, animates on mount instead of in-viewport */
  immediate?: boolean;
};

const variantMap = {
  fade: fadeIn,
  fadeUp,
  fadeUpSubtle,
};

export function Reveal({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  viewport = VIEWPORT,
  immediate = false,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : viewport}
      variants={variantMap[variant]}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
