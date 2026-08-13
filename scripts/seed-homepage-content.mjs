/**
 * Safe, idempotent S-DREAM homepage seed for Sanity.
 *
 * Uses targeted createOrReplace / patch mutations only.
 * Does NOT use dataset import. Does NOT delete any documents.
 *
 * Usage:
 *   # Preview (default — no mutations):
 *   node --env-file=.env.local scripts/seed-homepage-content.mjs
 *   npm run seed:homepage
 *
 *   # Apply mutations (requires SANITY_API_WRITE_TOKEN):
 *   node --env-file=.env.local scripts/seed-homepage-content.mjs --apply
 *   npm run seed:homepage:apply
 *
 *   # Re-upload Figma image assets even if images already exist:
 *   node --env-file=.env.local scripts/seed-homepage-content.mjs --apply --force-images
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SEED_DOCUMENT_IDS,
  SEED_IMAGE_ASSETS,
  SITE_SETTINGS_SEED_FIELDS,
  buildAllSeedDocuments,
} from "./seed-homepage-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

async function fetchExistingDocuments(client) {
  return client.fetch(
    `*[_id in $ids]{ _id, _type, _updatedAt, title, name, siteName, heroHeading }`,
    { ids: SEED_DOCUMENT_IDS },
  );
}

async function fetchExistingImageAssetIds(client) {
  const [siteSettings, homepage] = await client.fetch(
    `[*[_id == "siteSettings"][0].partnerLogo.asset._ref, *[_id == "homepage"][0].teamImage.asset._ref]`,
  );

  return {
    partnerLogo: siteSettings ?? undefined,
    teamPhoto: homepage ?? undefined,
  };
}

function printPreview({ projectId, dataset, existingDocs, seedPlan, imagePlan }) {
  const existingById = new Map(existingDocs.map((doc) => [doc._id, doc]));
  const creates = [];
  const updates = [];

  for (const id of SEED_DOCUMENT_IDS) {
    const existing = existingById.get(id);
    const plan = seedPlan.find((entry) => entry._id === id);
    if (!plan) continue;

    if (existing) {
      updates.push({ id, type: plan._type, existing });
    } else {
      creates.push({ id, type: plan._type });
    }
  }

  console.log("══════════════════════════════════════════════════════════════");
  console.log(" S-DREAM Homepage Seed — Preview");
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`Project:   ${projectId}`);
  console.log(`Dataset:   ${dataset}`);
  console.log(`Mode:      ${dryRun ? "DRY RUN (no mutations)" : "APPLY"}`);
  console.log("");
  console.log("Safety guarantees:");
  console.log("  • No dataset import");
  console.log("  • No --replace");
  console.log("  • No document deletions");
  console.log("  • Only deterministic seed IDs are touched");
  console.log("  • Unrelated documents in the dataset are NOT modified");
  console.log("");

  console.log("Document types affected:");
  const types = [...new Set(seedPlan.map((doc) => doc._type))].sort();
  for (const type of types) {
    const count = seedPlan.filter((doc) => doc._type === type).length;
    console.log(`  • ${type} (${count})`);
  }
  console.log("");

  console.log(`Documents to CREATE (${creates.length}):`);
  if (creates.length === 0) {
    console.log("  (none — all seed documents already exist)");
  } else {
    for (const item of creates) {
      console.log(`  + ${item.id}  [_type: ${item.type}]`);
    }
  }
  console.log("");

  console.log(`Documents to UPDATE (${updates.length}):`);
  if (updates.length === 0) {
    console.log("  (none — all seed documents are new)");
  } else {
    for (const item of updates) {
      const label =
        item.existing.heroHeading ??
        item.existing.title ??
        item.existing.siteName ??
        item.existing.name ??
        "(existing document)";
      console.log(
        `  ~ ${item.id}  [_type: ${item.type}]  last updated: ${item.existing._updatedAt ?? "unknown"}`,
      );
      console.log(`      current: ${label}`);
    }
  }
  console.log("");

  console.log("Singleton merge strategy:");
  console.log(
    "  • siteSettings — patch seed fields only; preserves other fields (e.g. contactEmail)",
  );
  console.log("  • homepage     — createOrReplace (homepage singleton is seed-owned)");
  console.log("");

  console.log("Collection documents:");
  console.log(
    "  • researchArea, publication, contribution, activity — createOrReplace by seed ID",
  );
  console.log("");

  console.log("Documents to DELETE:");
  console.log("  (none)");
  console.log("");

  console.log("Person records:");
  console.log(
    "  (none — Figma homepage does not list individual researchers; not inventing names)",
  );
  console.log("");

  console.log("Image assets:");
  for (const asset of imagePlan) {
    console.log(
      `  • ${asset.key}: ${asset.action}${asset.existingAssetId ? ` (existing: ${asset.existingAssetId})` : ""}`,
    );
  }
  console.log("");

  console.log("Publication authors / DOI:");
  console.log("  • omitted — not shown in Figma (fields left empty intentionally)");
  console.log("");

  if (dryRun) {
    console.log("To apply these mutations:");
    console.log("  npm run seed:homepage:apply");
    console.log("");
    console.log("Requires SANITY_API_WRITE_TOKEN in .env.local (Editor permissions).");
  }
}

async function uploadImage(client, relativePath, filename) {
  const filePath = join(__dirname, relativePath);
  const buffer = readFileSync(filePath);
  return client.assets.upload("image", buffer, { filename });
}

async function resolveImageAssets(client, existingAssetIds) {
  const plan = [];
  const resolved = { ...existingAssetIds };

  for (const asset of SEED_IMAGE_ASSETS) {
    const existingId = existingAssetIds[asset.key];
    const shouldUpload = forceImages || !existingId;

    if (shouldUpload) {
      plan.push({
        key: asset.key,
        action: forceImages && existingId ? "re-upload (--force-images)" : "upload",
        existingAssetId: existingId,
      });
    } else {
      plan.push({
        key: asset.key,
        action: "reuse existing asset",
        existingAssetId: existingId,
      });
    }
  }

  if (!apply) {
    return { imageAssetIds: resolved, imagePlan: plan };
  }

  for (const asset of SEED_IMAGE_ASSETS) {
    const existingId = existingAssetIds[asset.key];
    const shouldUpload = forceImages || !existingId;

    if (shouldUpload) {
      const uploaded = await uploadImage(client, asset.relativePath, asset.filename);
      resolved[asset.key] = uploaded._id;
      console.log(`✓ uploaded ${asset.key} → ${uploaded._id}`);
    }
  }

  return { imageAssetIds: resolved, imagePlan: plan };
}

async function upsertCollectionDocument(client, doc) {
  return client.createOrReplace(doc);
}

async function upsertSiteSettings(client, doc) {
  const existing = await client.fetch(`*[_id == "siteSettings"][0]._id`);

  if (!existing) {
    return client.createIfNotExists(doc);
  }

  const patch = client.patch("siteSettings");
  for (const field of SITE_SETTINGS_SEED_FIELDS) {
    if (doc[field] !== undefined) {
      patch.set({ [field]: doc[field] });
    }
  }

  return patch.commit();
}

async function upsertHomepage(client, doc) {
  return client.createOrReplace(doc);
}

async function main() {
  const readClient = createReadClient();
  const existingDocs = await fetchExistingDocuments(readClient);
  const existingAssetIds = await fetchExistingImageAssetIds(readClient);

  const writeClient = dryRun ? null : createWriteClient();
  const clientForImages = writeClient ?? readClient;
  const { imageAssetIds, imagePlan } = await resolveImageAssets(
    clientForImages,
    existingAssetIds,
  );

  const { collectionDocuments, siteSettings, homepage } = buildAllSeedDocuments({
    teamPhoto: imageAssetIds.teamPhoto,
    partnerLogo: imageAssetIds.partnerLogo,
  });

  const seedPlan = [...collectionDocuments, siteSettings, homepage];

  printPreview({
    projectId,
    dataset,
    existingDocs,
    seedPlan,
    imagePlan,
  });

  if (dryRun) {
    return;
  }

  console.log("Applying mutations...\n");

  for (const doc of collectionDocuments) {
    await upsertCollectionDocument(writeClient, doc);
    console.log(`✓ ${doc._type} ${doc._id}`);
  }

  await upsertSiteSettings(writeClient, siteSettings);
  console.log("✓ siteSettings (patched seed fields)");

  await upsertHomepage(writeClient, homepage);
  console.log("✓ homepage (createOrReplace)");

  console.log("\nSeed applied successfully.");
  console.log("Re-run `npm run seed:homepage` anytime to preview idempotent updates.");
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
