/**
 * Backfill cvPathname + cvDownloadUrl on application documents created before
 * private Blob signed-download support.
 *
 * Usage:
 *   node --env-file=.env.local scripts/backfill-application-cv-links.mjs          # preview
 *   node --env-file=.env.local scripts/backfill-application-cv-links.mjs --apply    # mutate + verify
 */

import { createHmac } from "node:crypto";
import { createClient } from "@sanity/client";

const STUDIO_LINK_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const VERIFY_LOCAL_BASE = process.env.BACKFILL_VERIFY_BASE_URL?.trim() || "http://localhost:3000";

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
    token: readToken || writeToken,
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

function getSigningSecret() {
  return (
    process.env.APPLICATIONS_CV_SIGNING_SECRET?.trim() ||
    process.env.SANITY_REVALIDATE_SECRET?.trim()
  );
}

function getSiteBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }
  return "http://localhost:3000";
}

function extractCvPathname(blobUrl) {
  try {
    const { pathname } = new URL(blobUrl);
    return pathname.replace(/^\/+/, "") || null;
  } catch {
    return null;
  }
}

function signCvAccess(applicationId, expiresAtMs) {
  const secret = getSigningSecret();
  if (!secret) {
    throw new Error(
      "Missing APPLICATIONS_CV_SIGNING_SECRET (or SANITY_REVALIDATE_SECRET fallback).",
    );
  }

  return createHmac("sha256", secret)
    .update(`${applicationId}:${expiresAtMs}`)
    .digest("hex");
}

function buildStudioCvDownloadUrl(applicationId) {
  const expiresAtMs = Date.now() + STUDIO_LINK_TTL_MS;
  const token = signCvAccess(applicationId, expiresAtMs);
  const baseUrl = getSiteBaseUrl();

  return `${baseUrl}/api/applications/${encodeURIComponent(applicationId)}/cv?expires=${expiresAtMs}&token=${token}`;
}

function localVerifyUrl(storedUrl) {
  const parsed = new URL(storedUrl);
  return `${VERIFY_LOCAL_BASE.replace(/\/+$/, "")}${parsed.pathname}${parsed.search}`;
}

async function verifyDownloadUrl(storedUrl) {
  const localUrl = localVerifyUrl(storedUrl);

  for (const [label, url] of [
    ["stored cvDownloadUrl", storedUrl],
    ["local dev server", localUrl],
  ]) {
    try {
      const response = await fetch(url, { method: "GET" });
      console.log(`  verify (${label}): ${response.status} ${url}`);
      if (response.status === 200) {
        return { ok: true, status: response.status, url };
      }
    } catch (error) {
      console.log(`  verify (${label}): failed — ${error.message}`);
    }
  }

  return { ok: false, status: 0, url: storedUrl };
}

async function main() {
  const readClient = createReadClient();
  const docs = await readClient.fetch(
    `*[_type == "application"] | order(submittedAt asc) {
      _id,
      name,
      email,
      cvUrl,
      cvPathname,
      cvDownloadUrl,
      cvFilename
    }`,
  );

  const needsBackfill = docs.filter(
    (doc) =>
      !doc.cvPathname ||
      !doc.cvDownloadUrl ||
      doc.cvUrl,
  );

  console.log(`Found ${docs.length} application document(s).`);
  console.log(`${needsBackfill.length} need backfill.\n`);

  if (needsBackfill.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  for (const doc of needsBackfill) {
    const cvPathname = doc.cvPathname || extractCvPathname(doc.cvUrl);

    console.log(`${doc._id}`);
    console.log(`  name: ${doc.name}`);
    console.log(`  email: ${doc.email}`);

    if (!cvPathname) {
      console.log("  ✗ skipped — no cvUrl or cvPathname to derive pathname from");
      continue;
    }

    const cvDownloadUrl = buildStudioCvDownloadUrl(doc._id);
    console.log(`  cvPathname: ${cvPathname}`);
    console.log(`  cvDownloadUrl: ${cvDownloadUrl}`);

    if (dryRun) {
      console.log("  (dry run — not patched)");
      continue;
    }

    const writeClient = createWriteClient();
    await writeClient
      .patch(doc._id)
      .set({ cvPathname, cvDownloadUrl })
      .unset(["cvUrl"])
      .commit();

    console.log("  ✓ patched (removed legacy cvUrl)");

    const verify = await verifyDownloadUrl(cvDownloadUrl);
    console.log(
      verify.ok
        ? `  ✓ download verified (${verify.status})`
        : `  ✗ download verification failed`,
    );
  }

  if (dryRun) {
    console.log("\nDry run — no mutations. Re-run with --apply to backfill.");
    return;
  }

  console.log("\nRe-fetching patched documents…");
  const refreshed = await readClient.fetch(
    `*[_type == "application"] | order(submittedAt asc) {
      _id,
      name,
      cvPathname,
      cvDownloadUrl
    }`,
  );

  let allOk = true;
  for (const doc of refreshed) {
    console.log(`\n${doc._id} — ${doc.name}`);
    console.log(`  cvDownloadUrl: ${doc.cvDownloadUrl}`);
    const verify = await verifyDownloadUrl(doc.cvDownloadUrl);
    allOk = allOk && verify.ok;
  }

  console.log(`\n${allOk ? "All cvDownloadUrl checks passed." : "Some cvDownloadUrl checks failed."}`);
  if (!allOk) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("\nBackfill failed:", error.message);
  process.exit(1);
});
