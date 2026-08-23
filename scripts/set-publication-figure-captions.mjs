#!/usr/bin/env node
/**
 * Set figure captions on publication documents from scripts/data/publication-figure-captions.mjs
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-publication-figure-captions.mjs
 *   node --env-file=.env.local scripts/set-publication-figure-captions.mjs --apply
 */

import { createClient } from "@sanity/client";

import { PUBLICATION_FIGURE_CAPTIONS } from "./data/publication-figure-captions.mjs";

const apply = process.argv.includes("--apply");

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  });

  const ids = Object.keys(PUBLICATION_FIGURE_CAPTIONS);
  const publications = await client.fetch(
    `*[_type == "publication" && _id in $ids]{ _id, highlightTitle, title, figureCaption }`,
    { ids },
  );

  const byId = new Map(publications.map((publication) => [publication._id, publication]));
  const updates = [];

  for (const [id, entry] of Object.entries(PUBLICATION_FIGURE_CAPTIONS)) {
    const publication = byId.get(id);
    if (!publication) {
      console.warn(`Publication not found: ${id} (${entry.highlightTitle})`);
      continue;
    }

    updates.push({
      id,
      title: publication.title,
      highlightTitle: publication.highlightTitle,
      nextCaption: entry.figureCaption,
      currentCaption: publication.figureCaption?.trim() ?? "",
    });
  }

  if (updates.length === 0) {
    console.log("No matching publications to update.");
    return;
  }

  console.log(`Publications to update (${updates.length}):\n`);
  for (const update of updates) {
    console.log(`• ${update.highlightTitle ?? update.title}`);
    console.log(`  → ${update.nextCaption}\n`);
  }

  if (!apply) {
    console.log("Dry run only. Re-run with --apply to write to Sanity.");
    return;
  }

  let tx = client.transaction();
  for (const update of updates) {
    tx = tx.patch(update.id, (patch) => patch.set({ figureCaption: update.nextCaption }));
  }
  await tx.commit();

  console.log(`Applied figure captions to ${updates.length} publication(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
