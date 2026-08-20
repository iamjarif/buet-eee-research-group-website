/**
 * Strip stored CV download URLs from application documents and keep
 * applications as drafts only (invisible to the public Sanity API).
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-application-cv-links.mjs          # preview
 *   node --env-file=.env.local scripts/backfill-application-cv-links.mjs --apply    # mutate
 */

import { createClient } from "@sanity/client";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const dryRun = !apply;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
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
    perspective: "raw",
  });
}

function extractCvPathname(blobUrl) {
  try {
    const { pathname } = new URL(blobUrl);
    return pathname.replace(/^\/+/, "") || null;
  } catch {
    return null;
  }
}

function publishedId(documentId) {
  return documentId.startsWith("drafts.") ? documentId.slice("drafts.".length) : documentId;
}

async function main() {
  const client = createWriteClient();
  const docs = await client.fetch(
    `*[_type == "application"] | order(submittedAt asc) {
      _id,
      _type,
      name,
      email,
      message,
      status,
      submittedAt,
      cvUrl,
      cvPathname,
      cvDownloadUrl,
      cvFilename
    }`,
  );

  console.log(`Found ${docs.length} application document(s).\n`);

  if (docs.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  for (const doc of docs) {
    const id = publishedId(doc._id);
    const draftId = `drafts.${id}`;
    const cvPathname = doc.cvPathname || extractCvPathname(doc.cvUrl);
    const isPublished = !doc._id.startsWith("drafts.");

    console.log(`${doc._id}`);
    console.log(`  name: ${doc.name}`);
    console.log(`  unset cvDownloadUrl: ${doc.cvDownloadUrl ? "yes" : "already absent"}`);
    console.log(`  unpublish: ${isPublished ? "yes (move to draft)" : "already draft"}`);

    if (!cvPathname) {
      console.log("  ✗ skipped — no cvPathname (and no legacy cvUrl)");
      continue;
    }

    if (dryRun) {
      console.log("  (dry run — not patched)");
      continue;
    }

    const draftDoc = {
      _id: draftId,
      _type: "application",
      name: doc.name,
      email: doc.email,
      message: doc.message,
      cvPathname,
      cvFilename: doc.cvFilename,
      submittedAt: doc.submittedAt,
      status: doc.status ?? "new",
    };

    await client.createOrReplace(draftDoc);
    await client.patch(draftId).unset(["cvDownloadUrl", "cvUrl"]).commit();

    if (isPublished) {
      await client.delete(id);
    }

    console.log("  ✓ draft-only; cvDownloadUrl removed");
  }

  if (dryRun) {
    console.log("\nDry run — no mutations. Re-run with --apply to strip URLs and unpublish.");
  }
}

main().catch((error) => {
  console.error("\nBackfill failed:", error.message);
  process.exit(1);
});
