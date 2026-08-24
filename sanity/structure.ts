import type { StructureResolver } from "sanity/structure";

const SINGLETONS = [
  { type: "siteSettings", title: "Site Settings", id: "siteSettings" },
  { type: "homepage", title: "Homepage", id: "homepage" },
  { type: "syncState", title: "Publications Sync", id: "sync-state-publications" },
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map(({ type, title, id }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(type).documentId(id).title(title)),
      ),
      S.divider(),
      S.listItem()
        .title("Research Areas")
        .id("researchAreas")
        .child(
          S.documentTypeList("researchArea")
            .title("Research Areas")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Publications")
        .id("publications")
        .child(
          S.documentTypeList("publication")
            .title("Publications")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("People")
        .id("people")
        .child(
          S.documentTypeList("person")
            .title("People")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Patents")
        .id("patents")
        .child(
          S.documentTypeList("patent")
            .title("Patents")
            .defaultOrdering([{ field: "year", direction: "desc" }]),
        ),
      S.listItem()
        .title("Contributions")
        .id("contributions")
        .child(
          S.documentTypeList("contribution")
            .title("Contributions")
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Activities")
        .id("activities")
        .child(
          S.documentTypeList("activity")
            .title("Activities")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
      S.listItem()
        .title("Team Applications")
        .id("applications")
        .child(
          S.documentTypeList("application")
            .title("Team Applications")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),
    ]);

export default structure;
