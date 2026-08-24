#!/usr/bin/env node
/**
 * Remove the deprecated `year` field from all publication documents.
 *
 * Usage:
 *   node --env-file=.env.local scripts/unset-publication-years.mjs
 *   node --env-file=.env.local scripts/unset-publication-years.mjs --apply
 */

import { createClient } from "@sanity/client";

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

  const publications = await client.fetch(
    `*[_type == "publication" && defined(year)]{ _id, title, year }`,
  );

  if (publications.length === 0) {
    console.log("No publications have a year field to remove.");
    return;
  }

  console.log(
    apply
      ? `Removing year from ${publications.length} publication(s)…`
      : `[dry run] Would remove year from ${publications.length} publication(s):`,
  );

  for (const publication of publications) {
    console.log(`  • ${publication.title ?? publication._id} (${publication.year})`);
  }

  if (!apply) {
    console.log("\nRe-run with --apply to write changes.");
    return;
  }

  const transaction = client.transaction();
  for (const publication of publications) {
    transaction.patch(publication._id, (patch) => patch.unset(["year"]));
  }

  await transaction.commit();
  console.log(`\n✓ Removed year from ${publications.length} publication(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
