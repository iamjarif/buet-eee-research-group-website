import { defineField, defineType } from "sanity";

const HERO_POSITIONS = [
  { value: "fabrication", title: "Fabrication (top-left)" },
  { value: "device-physics", title: "Device Physics (top-right)" },
  { value: "ai-hardware", title: "AI Hardware (left)" },
  { value: "modeling-simulation", title: "Modeling & Simulation (right)" },
  { value: "3d-ic", title: "3D-IC (bottom-left)" },
  { value: "circuits", title: "Circuits (bottom-right)" },
] as const;

export const researchArea = defineType({
  name: "researchArea",
  title: "Research Area",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Shown on the homepage hero hex, research section, publications filter, and research page.",
      validation: (rule) => rule.required().error("Title is required."),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
      validation: (rule) => rule.required().error("Description is required."),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Used on the homepage hero hex and research pages.",
    }),
    defineField({
      name: "heroPosition",
      title: "Hero Hex Position",
      type: "string",
      description: "Which homepage hero hex displays this area. Do not change unless reordering the layout.",
      options: {
        list: [...HERO_POSITIONS],
        layout: "dropdown",
      },
      validation: (rule) => rule.required().error("Hero hex position is required."),
    }),
    defineField({
      name: "externalLink",
      title: "External Link",
      type: "url",
      description:
        "Optional link to an external resource related to this research area.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Use 01, 02, 03… for manual ordering.",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Unpublished research areas are hidden from the public website.",
      initialValue: false,
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
  ],
  preview: {
    select: { title: "title", subtitle: "displayOrder", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle != null ? `Order: ${subtitle}` : undefined,
      media,
    }),
  },
});

export default researchArea;
