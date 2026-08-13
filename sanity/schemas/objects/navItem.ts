import { defineField, defineType } from "sanity";

export const navItemFields = defineType({
  name: "navItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().error("Navigation label is required."),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path (e.g. /research) or external URL.",
      validation: (rule) => rule.required().error("Navigation link is required."),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

export default navItemFields;
