/** Canonical production origin — always used for SEO URLs. */
export const PRODUCTION_SITE_URL = "https://www.nadimchowdhury.com";

/** Fallback site metadata used when CMS content is unavailable. */
export const siteConfig = {
  name: "NC Group",
  fullName: "Wide-bandgap semiconductor device research at BUET",
  description:
    "University research group at BUET focused on wide-bandgap semiconductor device research, particularly Gallium Nitride (GaN) RF and power devices.",
  url: PRODUCTION_SITE_URL,
  locale: "en_US",
  localeHtml: "en",
  organization: "Bangladesh University of Engineering and Technology (BUET)",
  principalInvestigator: "Prof. Nadim Chowdhury",
  titleTemplate: "%s | NC Group — Prof. Nadim Chowdhury",
  defaultTitle: "NC Group | Prof. Nadim Chowdhury — BUET EEE",
  defaultOgImage: "/images/nc-group-logo.png",
} as const;

export type SiteConfig = typeof siteConfig;
