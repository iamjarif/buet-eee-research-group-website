import { defineField, defineType } from "sanity";

export const researchArea = defineType({
  name: "researchArea",
  title: "Research Area",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
