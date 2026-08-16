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
    }),
    defineField({
      name: "authorLine",
      title: "Author Line",
      type: "string",
      description:
        "Author names shown on listings (e.g. “T. Hossain, AKM A. Alam, N. Chowdhury”). Used when team author links are not set.",
    }),
    defineField({
      name: "journalOrConference",
      title: "Journal / Conference",
      type: "string",
      validation: (rule) =>
        rule.required().error("Journal or conference name is required."),
    }),
    defineField({
      name: "publicationType",
      title: "Publication Type",
      type: "string",
      options: {
        list: [
          { title: "Journal", value: "journal" },
          { title: "Conference", value: "conference" },
        ],
        layout: "radio",
      },
      description: "Used for filtering on the publications index page.",
    }),
    defineField({
      name: "categoryLabel",
      title: "Category Label",
      type: "string",
      description:
        "Serial label shown on the publications index (e.g. J1, J2 for journals; C1, C2 for conferences).",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[JC]\d+$/, {
            name: "categoryLabel",
            invert: false,
          })
          .error("Use a label like J1, J2, C1, or C2."),
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
      description: "Link opened when a publication is clicked (publisher, DOI, or repository).",
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ["http", "https"] }).warning(
          "An external URL is recommended so publications open off-site.",
        ),
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
      categoryLabel: "categoryLabel",
      year: "year",
      journal: "journalOrConference",
    },
    prepare: ({ title, categoryLabel, year, journal }) => ({
      title,
      subtitle: [categoryLabel, journal, year].filter(Boolean).join(" · "),
    }),
  },
});

export default publication;
