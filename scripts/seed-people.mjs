/**
 * Safe, idempotent NC Group people seed for Sanity.
 *
 * Transcribes the group's live team page into `person` documents. Uses targeted
 * createOrReplace mutations on deterministic seed IDs only. Does NOT use dataset
 * import. Does NOT delete any documents.
 *
 * Usage:
 *   # Preview (default — no mutations):
 *   node --env-file=.env.local scripts/seed-people.mjs
 *   npm run seed:people
 *
 *   # Apply mutations (requires SANITY_API_WRITE_TOKEN):
 *   node --env-file=.env.local scripts/seed-people.mjs --apply
 *   npm run seed:people:apply
 *
 *   # Re-upload portraits even when a person already has one:
 *   npm run seed:people:apply -- --force-images
 */

import { createClient } from "@sanity/client";

import {
  PEOPLE_SEED,
  PEOPLE_SEED_DOCUMENT_IDS,
  buildPersonDocument,
  getPortraitSource,
} from "./seed-people-data.mjs";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const forceImages = args.has("--force-images");
const dryRun = !apply;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();
const readToken = process.env.SANITY_API_READ_TOKEN?.trim();

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

function createReadClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: readToken,
    useCdn: false,
  });
}

function createWriteClient() {
  if (!writeToken) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Create an Editor token at sanity.io/manage and add it to .env.local (never NEXT_PUBLIC_*).",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  });
}

async function fetchExistingPeople(client) {
  const docs = await client.fetch(
    `*[_id in $ids]{ _id, name, position, _updatedAt, "portraitAssetId": photograph.asset._ref }`,
    { ids: PEOPLE_SEED_DOCUMENT_IDS },
  );

  return new Map(docs.map((doc) => [doc._id, doc]));
}

function printPreview({ existing, groupCounts }) {
  console.log("══════════════════════════════════════════════════════════════");
  console.log(" NC Group People Seed — Preview");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`Project:   ${projectId}`);
  console.log(`Dataset:   ${dataset}`);
  console.log(`Mode:      ${dryRun ? "DRY RUN (no mutations)" : "APPLY"}`);
  console.log("");
  console.log("Source:    https://sdreambuet2024.wixsite.com/s-dreambuet/team");
  console.log("");
  console.log("Safety guarantees:");
  console.log("  • No dataset import");
  console.log("  • No document deletions");
  console.log("  • Only person documents with deterministic seed IDs are touched");
  console.log("  • Unrelated documents in the dataset are NOT modified");
  console.log("");

  console.log("Roster groups:");
  for (const [group, count] of Object.entries(groupCounts)) {
    console.log(`  • ${group.padEnd(10)} ${count}`);
  }
  console.log("");

  const creates = PEOPLE_SEED.filter(
    (person) => !existing.has(`person-${person.slug}`),
  );
  const updates = PEOPLE_SEED.filter((person) => existing.has(`person-${person.slug}`));

  console.log(`Documents to CREATE (${creates.length}):`);
  if (creates.length === 0) {
    console.log("  (none — all seed people already exist)");
  } else {
    for (const person of creates) {
      const portrait = getPortraitSource(person.slug) ? "portrait" : "no portrait";
      console.log(
        `  + person-${person.slug}  [${person.group}]  ${person.name} (${portrait})`,
      );
    }
  }
  console.log("");

  console.log(`Documents to UPDATE (${updates.length}):`);
  if (updates.length === 0) {
    console.log("  (none — all seed people are new)");
  } else {
    for (const person of updates) {
      const doc = existing.get(`person-${person.slug}`);
      console.log(
        `  ~ person-${person.slug}  [${person.group}]  last updated: ${doc._updatedAt ?? "unknown"}`,
      );
      console.log(`      current: ${doc.name ?? "(unnamed)"}`);
    }
  }
  console.log("");

  console.log("Portraits:");
  console.log(
    `  • Downloaded from the live team page and uploaded to the Sanity asset pipeline`,
  );
  console.log(
    `  • Existing portraits are reused unless --force-images is passed (${forceImages ? "forcing re-upload" : "reusing"})`,
  );
  console.log("");

  console.log("Fields intentionally left empty:");
  console.log(
    "  • researchInterests — the live page does not list per-person interests",
  );
  console.log("  • biography — only the PI has one on the live page");
  console.log("");

  if (dryRun) {
    console.log("To apply these mutations:");
    console.log("  npm run seed:people:apply");
    console.log("");
    console.log("Requires SANITY_API_WRITE_TOKEN in .env.local (Editor permissions).");
  }
}

async function uploadPortrait(client, person) {
  const source = getPortraitSource(person.slug);
  if (!source) return undefined;

  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(
      `Failed to download portrait for ${person.name} (${response.status} ${response.statusText})`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: source.filename,
  });

  return asset._id;
}

async function main() {
  const readClient = createReadClient();
  const existing = await fetchExistingPeople(readClient);

  const groupCounts = PEOPLE_SEED.reduce((counts, person) => {
    counts[person.group] = (counts[person.group] ?? 0) + 1;
    return counts;
  }, {});

  printPreview({ existing, groupCounts });

  if (dryRun) return;

  const writeClient = createWriteClient();

  console.log("Applying mutations...\n");

  for (const person of PEOPLE_SEED) {
    const current = existing.get(`person-${person.slug}`);
    let portraitAssetId = current?.portraitAssetId;

    if (!portraitAssetId || forceImages) {
      const uploaded = await uploadPortrait(writeClient, person);
      if (uploaded) {
        portraitAssetId = uploaded;
        console.log(`  ↑ portrait uploaded for ${person.name} → ${uploaded}`);
      }
    }

    const document = buildPersonDocument(person, portraitAssetId);
    await writeClient.createOrReplace(document);
    console.log(`✓ person ${document._id}  [${person.group}]`);
  }

  console.log(`\nSeeded ${PEOPLE_SEED.length} people successfully.`);
  console.log("Re-run `npm run seed:people` anytime to preview idempotent updates.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  if (error.statusCode === 403 || /permission/i.test(error.message)) {
    console.error(
      "\nEnsure SANITY_API_WRITE_TOKEN is set in .env.local with Editor permissions.",
    );
  }
  process.exit(1);
});
