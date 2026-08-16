import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "publications", title: "Featured Publications" },
    { name: "research", title: "Research" },
    { name: "team", title: "Team" },
    { name: "activities", title: "Activities" },
    { name: "joinUs", title: "Join Us" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
      description: "Short label above the main heading (e.g. research group name).",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required().error("Hero heading is required."),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      rows: 4,
      group: "hero",
    }),
    defineField({
      name: "heroButtons",
      title: "Hero Buttons",
      type: "array",
      group: "hero",
      of: [{ type: "link" }],
      description:
        "Up to two buttons. First = secondary style (e.g. Meet the Team). Second = primary style (e.g. Explore Research →).",
      validation: (rule) => rule.max(2).warning("Two hero buttons is recommended."),
    }),

    // Featured Publications
    defineField({
      name: "publicationsSectionHeading",
      title: "Section Heading",
      type: "string",
      group: "publications",
    }),
    defineField({
      name: "publicationsSectionDescription",
      title: "Section Description",
      type: "text",
      rows: 3,
      group: "publications",
    }),
    defineField({
      name: "featuredPublications",
      title: "Featured Publications",
      type: "array",
      group: "publications",
      of: [{ type: "reference", to: [{ type: "publication" }] }],
      description: "Select publications to feature on the homepage.",
    }),

    // Research
    defineField({
      name: "researchSectionHeading",
      title: "Section Heading",
      type: "string",
      group: "research",
    }),
    defineField({
      name: "researchSectionDescription",
      title: "Section Description",
      type: "text",
      rows: 3,
      group: "research",
    }),
    defineField({
      name: "featuredResearchAreas",
      title: "Featured Research Areas",
      type: "array",
      group: "research",
      of: [{ type: "reference", to: [{ type: "researchArea" }] }],
    }),

    // Team
    defineField({
      name: "teamSectionHeading",
      title: "Section Heading",
      type: "string",
      group: "team",
    }),
    defineField({
      name: "teamSectionDescription",
      title: "Section Description",
      type: "text",
      rows: 4,
      group: "team",
    }),
    defineField({
      name: "teamImage",
      title: "Team Photo",
      type: "imageWithAlt",
      group: "team",
      description: "Group photo displayed in the team section on the homepage.",
    }),
    defineField({
      name: "teamSectionLink",
      title: "Team Section Link",
      type: "link",
      group: "team",
      description: 'Link for the "Meet the team" call-to-action (defaults to /people).',
    }),
    defineField({
      name: "featuredTeam",
      title: "Featured Team Members",
      type: "array",
      group: "team",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      description:
        "Optional featured members for other uses. The homepage team section uses the team photo above.",
    }),

    // Activities
    defineField({
      name: "activitiesSectionHeading",
      title: "Section Heading",
      type: "string",
      group: "activities",
    }),
    defineField({
      name: "activitiesSectionDescription",
      title: "Section Description",
      type: "text",
      rows: 3,
      group: "activities",
    }),
    defineField({
      name: "featuredActivities",
      title: "Featured Activities",
      type: "array",
      group: "activities",
      of: [{ type: "reference", to: [{ type: "activity" }] }],
      description:
        "Select activities to display. Leave empty to show latest published activities.",
    }),

    // Join Us
    defineField({
      name: "joinUsHeading",
      title: "Section Heading",
      type: "string",
      group: "joinUs",
    }),
    defineField({
      name: "joinUsDescription",
      title: "Section Description",
      type: "portableText",
      group: "joinUs",
    }),
    defineField({
      name: "joinUsButton",
      title: "Call-to-Action Button",
      type: "link",
      group: "joinUs",
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});

export default homepage;
