/** Fallback site metadata used when CMS content is unavailable. */
export const siteConfig = {
  name: "S-DREAM",
  fullName: "Semiconductor Device Research & Advanced Modeling",
  description:
    "University research group at BUET focused on wide-bandgap semiconductor device research, particularly Gallium Nitride (GaN) RF and power devices.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  organization: "Bangladesh University of Engineering and Technology (BUET)",
} as const;

export type SiteConfig = typeof siteConfig;
