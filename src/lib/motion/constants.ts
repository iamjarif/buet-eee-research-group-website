export const VIEWPORT = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -8% 0px" as const,
};

export type ViewportConfig = {
  once?: boolean;
  amount?: number;
  margin?: string;
};

export const VIEWPORT_SUBTLE = {
  once: true,
  amount: 0.15,
  margin: "0px 0px -5% 0px" as const,
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
