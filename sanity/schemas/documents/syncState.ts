import { defineField, defineType } from "sanity";

export const syncState = defineType({
  name: "syncState",
  title: "Sync State",
  type: "document",
  fields: [
    defineField({
      name: "lastSyncDate",
      title: "Last Sync Date",
      type: "date",
      description:
        "Cursor for incremental OpenAlex publication syncs (YYYY-MM-DD). After a successful run this is set to today minus 5 days to cover OpenAlex indexing lag.",
    }),
  ],
  preview: {
    select: { lastSyncDate: "lastSyncDate" },
    prepare: ({ lastSyncDate }: { lastSyncDate?: string }) => ({
      title: "Publications sync",
      subtitle: lastSyncDate ? `Last sync ${lastSyncDate}` : "Never synced",
    }),
  },
});

export default syncState;
