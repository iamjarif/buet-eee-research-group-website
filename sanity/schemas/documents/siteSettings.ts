import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer & Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: "general",
      validation: (rule) => rule.required().error("Site name is required."),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      rows: 3,
      group: "general",
      description: "Short description of the research group, used in global metadata.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "imageWithAlt",
      group: "general",
      description:
        "Optional logo image. The site wordmark is always shown in the header.",
    }),
    defineField({
      name: "partnerLogo",
      title: "Partner / Institution Logo",
      type: "imageWithAlt",
      group: "general",
      description:
        "Institutional logo shown beside the S-DREAM wordmark in the header and footer.",
    }),
    defineField({
      name: "headerCta",
      title: "Header Call-to-Action",
      type: "link",
      group: "navigation",
      description: 'Primary button in the header (e.g. "Join Us").',
    }),
    defineField({
      name: "mainNavigation",
      title: "Main Navigation",
      type: "array",
      group: "navigation",
      of: [{ type: "navItem" }],
      description: "Primary navigation links shown in the site header.",
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer Navigation",
      type: "array",
      group: "footer",
      of: [{ type: "navItem" }],
    }),
    defineField({
      name: "footerContent",
      title: "Footer Content",
      type: "portableText",
      group: "footer",
      description: "Additional footer text or information.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "footer",
      validation: (rule) => rule.email().warning("Enter a valid email address."),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "contactAddress",
      title: "Contact Address",
      type: "text",
      rows: 3,
      group: "footer",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "footer",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      group: "footer",
      description: 'e.g. "© 2026 S-DREAM, BUET. All rights reserved."',
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      description: "Fallback SEO metadata used when page-specific SEO is not set.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});

export default siteSettings;
