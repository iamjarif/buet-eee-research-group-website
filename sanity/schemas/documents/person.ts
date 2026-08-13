import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().error("Name is required."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      description: "e.g. Professor, PhD Researcher, MSc Student",
      validation: (rule) => rule.required().error("Position is required."),
    }),
    defineField({
      name: "photograph",
      title: "Photograph",
      type: "imageWithAlt",
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "portableText",
    }),
    defineField({
      name: "researchInterests",
      title: "Research Interests",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email().warning("Enter a valid email address."),
    }),
    defineField({
      name: "externalProfileLinks",
      title: "External Profile Links",
      type: "array",
      of: [{ type: "link" }],
      description: "Links to Google Scholar, LinkedIn, ORCID, etc.",
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
      description: "Lower numbers appear first in team listings.",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Inactive members are hidden from the public website.",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "position", media: "photograph" },
  },
});

export default person;
