import { defineField, defineType } from "sanity";

export const imageWithAltFields = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      description:
        "Describe the image for screen readers and SEO. Required for meaningful images.",
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { asset?: { _ref?: string } } | undefined;
          if (parent?.asset?._ref && !alt) {
            return "Alternative text is required when an image is provided.";
          }
          return true;
        }),
    }),
  ],
});

export default imageWithAltFields;
