"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { VIEWPORT, STAGGER, type ViewportConfig } from "@/lib/motion/constants";
import { createStaggerContainer, fadeUpSubtle } from "@/lib/motion/variants";

type StaggerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  viewport?: ViewportConfig;
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

type StaggerListProps = Omit<HTMLMotionProps<"ul">, "children"> & {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  viewport?: ViewportConfig;
  immediate?: boolean;
};

export function StaggerList({
  children,
  className,
  stagger = STAGGER.normal,
  delayChildren = 0,
  viewport = VIEWPORT,
  immediate = false,
  ...props
}: StaggerListProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <ul className={className} {...(props as React.HTMLAttributes<HTMLUListElement>)}>
        {children}
      </ul>
    );
  }

  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate={immediate ? "visible" : undefined}
      whileInView={immediate ? undefined : "visible"}
      viewport={immediate ? undefined : viewport}
      variants={createStaggerContainer(stagger, delayChildren)}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

type StaggerListItemProps = Omit<HTMLMotionProps<"li">, "children"> & {
  children: ReactNode;
};

export function StaggerListItem({ children, className, ...props }: StaggerListItemProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <li className={className} {...(props as React.HTMLAttributes<HTMLLIElement>)}>
        {children}
      </li>
    );
  }

  return (
    <motion.li className={className} variants={fadeUpSubtle} {...props}>
      {children}
    </motion.li>
  );
}

export default Stagger;
