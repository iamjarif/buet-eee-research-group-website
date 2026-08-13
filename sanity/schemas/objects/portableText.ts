import { defineArrayMember, defineType } from "sanity";

/**
 * Portable Text block content for rich text fields.
 * Visual styling is controlled by the codebase, not CMS fields.
 */
export const portableTextFields = defineType({
  name: "portableText",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "string",
                title: "URL",
                description: "Internal path (e.g. /research) or external URL.",
                validation: (rule) =>
                  rule.custom((value: string | undefined) => {
                    if (!value) return true;
                    if (value.startsWith("/")) return true;
                    try {
                      const parsed = new URL(value);
                      if (["http:", "https:", "mailto:"].includes(parsed.protocol)) {
                        return true;
                      }
                    } catch {
                      return "Enter an internal path or a valid URL.";
                    }
                    return "Enter an internal path or a valid URL.";
                  }),
              },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in New Tab",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
  ],
});

export default portableTextFields;
