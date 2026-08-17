/**
 * Design tokens extracted from the NC Group Website UI Figma file.
 * Source: https://www.figma.com/design/XEgPsX6sQKIDlKFVzIAeog/S-DREAM-Website-UI
 *
 * CSS custom properties are defined in `src/app/globals.css`.
 * Use Tailwind utilities (e.g. `text-brand-primary`, `bg-surface-subtle`) or
 * these references when building components.
 */

export const designTokens = {
  colors: {
    brand: {
      primary: "var(--color-brand-primary)",
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      tertiary: "var(--color-text-tertiary)",
      muted: "var(--color-text-muted)",
      inverse: "var(--color-text-inverse)",
      inverseSecondary: "var(--color-text-inverse-secondary)",
      inverseMuted: "var(--color-text-inverse-muted)",
    },
    surface: {
      base: "var(--color-surface-base)",
      subtle: "var(--color-surface-subtle)",
      inverse: "var(--color-surface-inverse)",
      gradientStart: "var(--color-surface-gradient-start)",
    },
    border: {
      default: "var(--color-border-default)",
      strong: "var(--color-border-strong)",
      subtle: "var(--color-border-subtle)",
    },
  },

  typography: {
    fontFamily: {
      sans: "var(--font-sans)",
      /** Alias — same as sans (Host Grotesk site-wide) */
      display: "var(--font-display)",
    },
    weight: {
      display: "var(--weight-display)",
      heading: "var(--weight-heading)",
      body: "var(--weight-body)",
      labelMd: "var(--weight-label-md)",
      labelSm: "var(--weight-label-sm)",
      labelXs: "var(--weight-label-xs)",
      overline: "var(--weight-overline)",
      overlineSm: "var(--weight-overline-sm)",
      caption: "var(--weight-caption)",
      stat: "var(--weight-stat)",
    },
    display: {
      xl: "var(--text-display-xl)",
      lg: "var(--text-display-lg)",
      md: "var(--text-display-md)",
      sm: "var(--text-display-sm)",
    },
    heading: {
      lg: "var(--text-heading-lg)",
      md: "var(--text-heading-md)",
      sm: "var(--text-heading-sm)",
    },
    body: {
      lg: "var(--text-body-lg)",
      md: "var(--text-body-md)",
      base: "var(--text-body-base)",
      sm: "var(--text-body-sm)",
      xs: "var(--text-body-xs)",
    },
    label: {
      md: "var(--text-label-md)",
      sm: "var(--text-label-sm)",
      xs: "var(--text-label-xs)",
    },
    overline: {
      default: "type-overline",
      sm: "type-overline-sm",
    },
    caption: "var(--text-caption)",
    stat: {
      xl: "var(--text-stat-xl)",
    },
  },

  spacing: {
    sectionY: "var(--spacing-section-y)",
    sectionYCompact: "var(--spacing-section-y-compact)",
    containerX: "var(--spacing-container-x)",
    contentGap: "var(--spacing-content-gap)",
    sectionGap: "var(--spacing-section-gap)",
    introGap: "var(--spacing-intro-gap)",
    eyebrowGap: "var(--spacing-eyebrow-gap)",
    buttonGap: "var(--spacing-button-gap)",
    buttonX: "var(--spacing-button-x)",
    buttonY: "var(--spacing-button-y)",
  },

  layout: {
    contentWidth: "var(--layout-content-width)",
    headerHeight: "var(--layout-header-height)",
    eyebrowLineWidth: "var(--layout-eyebrow-line-width)",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

/** Raw color values from Figma — useful for metadata, OG images, and non-CSS contexts. */
export const colorValues = {
  brandPrimary: "#4684f3",
  textPrimary: "#111113",
  textSecondary: "#55565b",
  textTertiary: "#8a8b90",
  textMuted: "#83878b",
  textInverse: "#ffffff",
  textInverseSecondary: "#f1f2f3",
  textInverseMuted: "rgb(241 242 243 / 0.7)",
  surfaceBase: "#ffffff",
  surfaceSubtle: "#f8f8f8",
  surfaceInverse: "#101214",
  surfaceGradientStart: "#e3e8eb",
  borderDefault: "#e7e7e9",
  borderStrong: "#d2d2d2",
  borderSubtle: "#d2d5d8",
} as const;

/** Raw typography scale from Figma text styles. */
export const typographyValues = {
  display: {
    xl: {
      fontSize: "74px",
      lineHeight: "78.44px",
      letterSpacing: "-1.85px",
      weight: 600,
    },
    lg: {
      fontSize: "60px",
      lineHeight: "61.2px",
      letterSpacing: "-1.2px",
      weight: 600,
    },
    md: {
      fontSize: "46px",
      lineHeight: "51.52px",
      letterSpacing: "-0.84px",
      weight: 600,
    },
    sm: { fontSize: "36px", lineHeight: "45px", letterSpacing: "0", weight: 600 },
  },
  heading: {
    lg: {
      fontSize: "30px",
      lineHeight: "34.5px",
      letterSpacing: "-0.45px",
      weight: 500,
    },
    md: { fontSize: "28px", lineHeight: "33px", letterSpacing: "0", weight: 500 },
    sm: { fontSize: "18px", lineHeight: "33px", letterSpacing: "0", weight: 500 },
  },
  body: {
    lg: { fontSize: "18px", lineHeight: "29.25px", letterSpacing: "0", weight: 400 },
    md: { fontSize: "16px", lineHeight: "26.56px", letterSpacing: "0", weight: 400 },
    base: {
      fontSize: "15.5px",
      lineHeight: "25.42px",
      letterSpacing: "0",
      weight: 400,
    },
    sm: { fontSize: "14.5px", lineHeight: "23.2px", letterSpacing: "0", weight: 400 },
    xs: { fontSize: "14px", lineHeight: "20.5px", letterSpacing: "0", weight: 400 },
  },
  label: {
    md: { fontSize: "16px", lineHeight: "19.5px", letterSpacing: "0", weight: 500 },
    sm: { fontSize: "15px", lineHeight: "22.5px", letterSpacing: "0.3px", weight: 600 },
    xs: {
      fontSize: "13px",
      lineHeight: "19.5px",
      letterSpacing: "0.065px",
      weight: 400,
    },
  },
  overline: {
    default: {
      fontSize: "11px",
      lineHeight: "16.5px",
      letterSpacing: "1.54px",
      weight: 500,
    },
    sm: { fontSize: "10px", lineHeight: "15px", letterSpacing: "1.6px", weight: 400 },
  },
  caption: {
    fontSize: "11.5px",
    lineHeight: "16.1px",
    letterSpacing: "0",
    weight: 400,
  },
  stat: {
    xl: { fontSize: "60px", lineHeight: "60px", letterSpacing: "0", weight: 600 },
  },
} as const;

export type DesignTokens = typeof designTokens;
