import { defineField, defineType } from "sanity";

const SOCIAL_PLATFORMS = [
  { title: "LinkedIn", value: "linkedin" },
  { title: "Google Scholar", value: "googleScholar" },
  { title: "ResearchGate", value: "researchGate" },
  { title: "ORCID", value: "orcid" },
  { title: "Twitter / X", value: "twitter" },
  { title: "Facebook", value: "facebook" },
  { title: "YouTube", value: "youtube" },
  { title: "GitHub", value: "github" },
  { title: "Website", value: "website" },
  { title: "Other", value: "other" },
] as const;

export const socialLinkFields = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: SOCIAL_PLATFORMS.map(({ title, value }) => ({ title, value })) },
      validation: (rule) => rule.required().error("Platform is required."),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["http", "https"] })
          .error("A valid URL is required."),
    }),
    defineField({
      name: "label",
      title: "Custom Label",
      type: "string",
      description: "Optional override for the link label shown to users.",
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});

export default socialLinkFields;
