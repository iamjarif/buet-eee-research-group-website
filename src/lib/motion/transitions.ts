import { DURATION } from "./constants";

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeEditorial = [0.25, 0.1, 0.25, 1] as const;
export const easeHover = [0.33, 1, 0.68, 1] as const;

export const transitionMicro = {
  duration: DURATION.micro,
  ease: easeOut,
} as const;

export const transitionHover = {
  duration: DURATION.hover,
  ease: easeHover,
} as const;

export const transitionHoverSlow = {
  duration: DURATION.hoverSlow,
  ease: easeHover,
} as const;

export const transitionUI = {
  duration: DURATION.ui,
  ease: easeOut,
} as const;

export const transitionSection = {
  duration: DURATION.section,
  ease: easeEditorial,
} as const;

export const transitionHero = {
  duration: DURATION.hero,
  ease: easeEditorial,
} as const;

/** Shared CSS easing for group-hover utilities */
export const hoverEaseClass = "ease-[cubic-bezier(0.33,1,0.68,1)]";
