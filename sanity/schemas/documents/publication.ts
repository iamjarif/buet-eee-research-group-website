import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("Publication title is required."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 120,
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      description:
        "Link to team member profiles. Names update automatically when changed.",
      validation: (rule) =>
        rule.min(1).warning("At least one author reference is recommended."),
    }),
    defineField({
      name: "journalOrConference",
      title: "Journal / Conference",
      type: "string",
      validation: (rule) =>
        rule.required().error("Journal or conference name is required."),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
      description: "Digital Object Identifier (without https://doi.org/ prefix).",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to the paper on a publisher or repository website.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
    }),
    defineField({
      name: "researchAreas",
      title: "Research Areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "researchArea" }] }],
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Featured publications can be surfaced on the homepage or listings.",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Optional thumbnail or figure associated with the publication.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within listings.",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Year (Newest First)",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      journal: "journalOrConference",
    },
    prepare: ({ title, year, journal }) => ({
      title,
      subtitle: [journal, year].filter(Boolean).join(" · "),
    }),
  },
});

export default publication;
