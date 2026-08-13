import { defineField, defineType } from "sanity";

export const contribution = defineType({
  name: "contribution",
  title: "Contribution",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: 'Highlight value (e.g. "50+", "12", "100%").',
      validation: (rule) => rule.required().error("Value is required."),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Short label (e.g. "Publications", "Research Projects").',
      validation: (rule) => rule.required().error("Label is required."),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      description: "Optional link to a related page or external resource.",
    }),
    defineField({
      name: "icon",
      title: "Icon / Image",
      type: "imageWithAlt",
      description:
        "Optional icon or image. Alt text should be empty for decorative icons.",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
      initialValue: 0,
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
    select: { title: "label", subtitle: "value", media: "icon" },
    prepare: ({ title, subtitle, media }) => ({
      title: `${subtitle} — ${title}`,
      media,
    }),
  },
});

export default contribution;
