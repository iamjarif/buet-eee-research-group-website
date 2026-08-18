/**
 * Replace all Sanity patent documents with entries from the CV (July 2026).
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-cv-patents.mjs          # preview
 *   node --env-file=.env.local scripts/import-cv-patents.mjs --apply    # mutate
 */

import { createClient } from "@sanity/client";
import { buildCvPatents } from "./data/cv-patents.mjs";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
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
      "Missing SANITY_API_WRITE_TOKEN. Add an Editor token to .env.local.",
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

async function main() {
  const patents = buildCvPatents();
  const granted = patents.filter((patent) => patent.status === "granted");
  const pending = patents.filter((patent) => patent.status !== "granted");

  const readClient = createReadClient();
  const existing = await readClient.fetch(
    `*[_type == "patent"]{ _id, title, patentNumber, status }`,
  );

  console.log(`CV patents to import: ${patents.length} (${granted.length} granted, ${pending.length} pending).`);
  console.log(`Existing Sanity patents: ${existing.length}.`);
  console.log("");

  for (const [index, patent] of patents.entries()) {
    const link = patent.externalUrl ? " ↗" : "";
    console.log(
      `${index + 1}. [${patent.status}] ${patent.patentNumber} — ${patent.title}${link}`,
    );
  }

  if (dryRun) {
    console.log("");
    console.log("Dry run — no mutations. Re-run with --apply to replace Sanity patents.");
    return;
  }

  const client = createWriteClient();

  console.log("");
  console.log("Deleting existing patents…");
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`  ✗ deleted ${doc._id} (${doc.patentNumber ?? doc.title})`);
  }

  console.log("");
  console.log("Creating CV patents…");
  for (const patent of patents) {
    await client.createOrReplace(patent);
    console.log(`  ✓ ${patent.patentNumber}`);
  }

  console.log("");
  console.log(`Imported ${patents.length} patents into Sanity.`);
}

main().catch((error) => {
  console.error("\nImport failed:", error.message);
  process.exit(1);
});
