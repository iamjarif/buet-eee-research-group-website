/**
 * Intersection threshold must stay at 0. A ratio like 0.2 is relative to the
 * *element*, so a tall roster or research chapter can never reach 20% visible
 * inside a phone viewport and stays stuck at opacity 0.
 */
export const VIEWPORT = {
  once: true,
  amount: 0,
  margin: "0px 0px -40px 0px" as const,
};

export type ViewportConfig = {
  once?: boolean;
  amount?: number | "some" | "all";
  margin?: string;
};

export const VIEWPORT_SUBTLE = {
  once: true,
  amount: 0,
  margin: "0px 0px -24px 0px" as const,
};

/** Footer should not animate until it is meaningfully on screen. */
export const VIEWPORT_FOOTER = {
  once: true,
  amount: 0.25,
  margin: "0px 0px -20% 0px" as const,
};

export const DURATION = {
  micro: 0.2,
  hover: 0.35,
  hoverSlow: 0.5,
  ui: 0.35,
  section: 0.65,
  hero: 0.85,
} as const;

export const STAGGER = {
  tight: 0.06,
  normal: 0.1,
  relaxed: 0.14,
  hero: 0.12,
} as const;

export const DISTANCE = {
  sm: 12,
  md: 20,
  lg: 28,
} as const;
