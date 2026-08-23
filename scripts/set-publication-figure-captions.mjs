#!/usr/bin/env node
/**
 * Set placeholder figure captions on all publication documents.
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-publication-figure-captions.mjs
 *   node --env-file=.env.local scripts/set-publication-figure-captions.mjs --apply
 */

import { createClient } from "@sanity/client";

const apply = process.argv.includes("--apply");

const DUMMY_FIGURE_CAPTIONS = [
  "Fig. 1. Cross-sectional schematic of the device structure.",
  "Fig. 1. Measured I–V characteristics at room temperature.",
  "Fig. 1. Fabrication process flow for the AlGaN/GaN heterostructure.",
  "Fig. 1. TCAD simulation mesh and boundary conditions.",
  "Fig. 1. Comparison of experimental and modeled results.",
  "Fig. 1. Optical micrograph of the fabricated device.",
];

function dummyFigureCaption(index) {
  return DUMMY_FIGURE_CAPTIONS[index % DUMMY_FIGURE_CAPTIONS.length];
}

async function main() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    perspective: "raw",
  });

  const publications = await client.fetch(
    `*[_type == "publication"] | order(year desc, title asc) {
      _id,
      title,
      figureCaption
    }`,
  );

  if (publications.length === 0) {
    console.log("No publications found.");
    return;
  }

  const updates = publications.map((publication, index) => ({
    id: publication._id,
    title: publication.title,
    nextCaption: dummyFigureCaption(index),
    currentCaption: publication.figureCaption?.trim() ?? "",
  }));

  console.log(`Publications to update (${updates.length}):\n`);
  for (const update of updates) {
    console.log(`• ${update.title}`);
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
