"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import {
  getButtonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { hoverEaseClass, transitionHover } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

type LinkButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  href: string;
  external?: boolean;
  className?: string;
  onClick?: () => void;
};

const arrowHoverClass = cn(
  "inline-block transition-transform duration-300",
  hoverEaseClass,
  "group-hover:translate-x-1",
);

function renderArrowContent(children: ReactNode) {
  const text = String(children).trim();
  const arrowMatch = text.match(/^(.*?)\s*→\s*$/);

  if (!arrowMatch) return children;

  const label = arrowMatch[1].trim();

  return (
    <>
      <span>{label}</span>
      <span aria-hidden className={arrowHoverClass}>
        →
      </span>
    </>
  );
}

const motionHover = {
  y: -2,
  transition: transitionHover,
};

const motionTap = {
  scale: 0.985,
  y: 0,
  transition: transitionHover,
};

export function Button({
  variant = "primary",
  size = "default",
  children,
  className,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const reduced = useReducedMotion();
  const classes = cn("group", getButtonClasses(variant, size, className));

  if (reduced) {
    return (
      <button type={type} className={classes} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      whileHover={motionHover}
      whileTap={motionTap}
    >
      {children}
    </motion.button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "default",
  children,
  className,
  href,
  external = false,
  onClick,
}: LinkButtonProps) {
  const reduced = useReducedMotion();
  const classes = cn("group", getButtonClasses(variant, size, className));
  const isExternal = external || href.startsWith("http");
  const content = renderArrowContent(children);

  if (reduced) {
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <motion.a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        whileHover={motionHover}
        whileTap={motionTap}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div className="inline-flex" whileHover={motionHover} whileTap={motionTap}>
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    </motion.div>
  );
}

export default Button;
