"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { VIEWPORT, STAGGER } from "@/lib/motion/constants";
import { createStaggerContainer, fadeUpSubtle } from "@/lib/motion/variants";

type StaggerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  viewport?: typeof VIEWPORT;
  /** When true, animates on mount instead of in-viewport */
  immediate?: boolean;
};

export function Stagger({
  children,
  className,
  stagger = STAGGER.normal,
  delayChildren = 0,
  viewport = VIEWPORT,
  immediate = false,
  ...props
}: StaggerProps) {
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
      variants={createStaggerContainer(stagger, delayChildren)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
};

export function StaggerItem({ children, className, ...props }: StaggerItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div className={className} variants={fadeUpSubtle} {...props}>
      {children}
    </motion.div>
  );
}

export default Stagger;
