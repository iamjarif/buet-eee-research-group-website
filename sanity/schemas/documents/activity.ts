import { defineField, defineType } from "sanity";

const ACTIVITY_CATEGORIES = [
  { title: "News", value: "news" },
  { title: "Event", value: "event" },
  { title: "Publication", value: "publication" },
  { title: "Award", value: "award" },
  { title: "Collaboration", value: "collaboration" },
  { title: "Other", value: "other" },
] as const;

export const activity = defineType({
  name: "activity",
  title: "Activity",
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
        maxLength: 120,
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required().error("Date is required."),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ACTIVITY_CATEGORIES.map(({ title, value }) => ({ title, value })),
      },
      validation: (rule) => rule.required().error("Category is required."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Optional link to an external article or event page.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Used when manually ordering activities on the homepage.",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Unpublished activities are hidden from the public website.",
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
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
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
      date: "date",
      category: "category",
      media: "image",
    },
    prepare: ({ title, date, category, media }) => ({
      title,
      subtitle: [category, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});

export default activity;
