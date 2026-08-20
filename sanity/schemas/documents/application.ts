import { defineField, defineType } from "sanity";

import { CvOpenInput } from "../../components/CvOpenInput";

export const application = defineType({
  name: "application",
  title: "Team Application",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cvFilename",
      title: "CV",
      type: "string",
      description:
        "Stored filename only. Download links are minted in email, not saved on this document.",
      readOnly: true,
      components: {
        input: CvOpenInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cvPathname",
      title: "CV Blob Path",
      type: "string",
      description: "Internal Vercel Blob pathname. Not directly accessible without auth.",
      readOnly: true,
      hidden: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Submitted (Newest First)",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare: ({ title, subtitle, status, submittedAt }) => ({
      title: title ?? "Application",
      subtitle: [subtitle, status, submittedAt?.slice(0, 10)].filter(Boolean).join(" · "),
    }),
  },
});

export default application;
