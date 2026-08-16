import { defineField, defineType } from "sanity";

export const patent = defineType({
  name: "patent",
  title: "Patent",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("Patent title is required."),
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
      name: "inventors",
      title: "Inventors",
      type: "array",
      of: [{ type: "reference", to: [{ type: "person" }] }],
      description:
        "Link to team member profiles. Names update automatically when changed.",
    }),
    defineField({
      name: "inventorLine",
      title: "Inventor Line",
      type: "string",
      description:
        "Inventor names shown on pending application cards (e.g. “Koon Hoo Teo, Nadim Chowdhury”).",
    }),
    defineField({
      name: "patentNumber",
      title: "Patent Number",
      type: "string",
      description: "Official patent or application number.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Granted", value: "granted" },
          { title: "Pending", value: "pending" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "granted",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: "Grant or filing year shown in listings.",
      validation: (rule) =>
        rule
          .required()
          .integer()
          .min(1900)
          .max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description:
        "Link opened when a patent is clicked (USPTO, Google Patents, or repository).",
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ["http", "https"] }).warning(
          "An external URL is recommended so patents open off-site.",
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
      status: "status",
      patentNumber: "patentNumber",
    },
    prepare: ({ title, year, status, patentNumber }) => ({
      title,
      subtitle: [patentNumber, status, year].filter(Boolean).join(" · "),
    }),
  },
});

export default patent;
