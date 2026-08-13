import { defineField, defineType } from "sanity";

export const linkFields = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().error("Link label is required."),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      description: "Internal path (e.g. /research) or external URL.",
      validation: (rule) =>
        rule
          .required()
          .error("Link URL is required.")
          .custom((value) => {
            if (!value) return true;
            if (value.startsWith("/")) return true;

            try {
              const parsed = new URL(value);
              if (["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol)) {
                return true;
              }
            } catch {
              return "Enter an internal path (e.g. /research) or a valid URL.";
            }

            return "Enter an internal path (e.g. /research) or a valid URL.";
          }),
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

export default linkFields;
