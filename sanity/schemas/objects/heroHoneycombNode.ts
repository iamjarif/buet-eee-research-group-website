import { defineField, defineType } from "sanity";

/** Grid slot identifiers — must match src/lib/hero-honeycomb.ts */
export const HERO_HONEYCOMB_POSITIONS = [
  { value: "fabrication", title: "Fabrication (top-left)" },
  { value: "device-physics", title: "Device Physics (top-right)" },
  { value: "ai-hardware", title: "AI Hardware (left)" },
  { value: "modeling-simulation", title: "Modeling & Simulation (right)" },
  { value: "3d-ic", title: "3D-IC (bottom-left)" },
  { value: "circuits", title: "Circuits (bottom-right)" },
] as const;

export const heroHoneycombNode = defineType({
  name: "heroHoneycombNode",
  title: "Hero Honeycomb Node",
  type: "object",
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      options: {
        list: [...HERO_HONEYCOMB_POSITIONS],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Use a line break in the label for two lines (e.g. "Modeling &\\nSimulation").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Publications Slug",
      type: "string",
      description: "URL slug for the linked publications category.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "imageWithAlt",
      description:
        "Optional hex background. Leave empty for plain hex styling (e.g. AI Hardware until an image is ready).",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "position",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const positionLabel =
        HERO_HONEYCOMB_POSITIONS.find((item) => item.value === subtitle)?.title ??
        subtitle;
      return {
        title: title?.replace("\\n", " ") ?? "Honeycomb node",
        subtitle: positionLabel,
        media,
      };
    },
  },
});

export default heroHoneycombNode;
