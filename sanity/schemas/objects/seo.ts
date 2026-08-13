import { defineField, defineType } from "sanity";

export const seoFields = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Page title for search engines. Leave empty to use the document title.",
      validation: (rule) =>
        rule.max(70).warning("Keep meta titles under 70 characters."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Brief summary for search engine results.",
      validation: (rule) =>
        rule.max(160).warning("Keep meta descriptions under 160 characters."),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Image used when sharing on social media (1200×630 recommended).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "When enabled, search engines are asked not to index this page.",
      initialValue: false,
    }),
  ],
});

export default seoFields;
