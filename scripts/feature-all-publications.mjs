/**
 * Mark every publication as featured (isFeatured: true).
 *
 * Usage:
 *   node --env-file=.env.local scripts/feature-all-publications.mjs
 *   node --env-file=.env.local scripts/feature-all-publications.mjs --apply
 */

import { createClient } from "@sanity/client";

const apply = process.argv.includes("--apply");
const dryRun = !apply;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

if (!writeToken) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Add an Editor token to .env.local and retry with --apply.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
  perspective: "raw",
});

const query = `*[_type == "publication" && isFeatured != true]{
  _id,
  title,
  isFeatured
}`;

async function main() {
  const publications = await client.fetch(query);

  if (publications.length === 0) {
    console.log("All publications are already featured.");
    return;
  }

  console.log(
    dryRun
      ? `[dry run] Would mark ${publications.length} publication(s) as featured:`
      : `Marking ${publications.length} publication(s) as featured…`,
  );

  for (const publication of publications) {
    console.log(`  • ${publication.title ?? publication._id}`);
  }

  if (dryRun) {
    console.log("\nRe-run with --apply to write changes.");
    return;
  }

  const transaction = client.transaction();
  for (const publication of publications) {
    transaction.patch(publication._id, { set: { isFeatured: true } });
  }

  await transaction.commit();
  console.log(`\n✓ Updated ${publications.length} publication(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
