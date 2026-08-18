/**
 * Register (or update) a Sanity webhook that calls /api/revalidate on publish.
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-sanity-revalidate-webhook.mjs --url https://your-site.vercel.app
 *   npm run setup:webhook -- --url https://your-site.vercel.app
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_REVALIDATE_SECRET
 *   SANITY_DEPLOY_TOKEN (preferred — Deploy token with webhook permissions)
 *   SANITY_API_WRITE_TOKEN (fallback — needs sanity.project.webhooks grant)
 */

const WEBHOOK_NAME = "Vercel on-demand revalidation";

const args = process.argv.slice(2);
const urlFlagIndex = args.indexOf("--url");
const siteUrlArg = urlFlagIndex >= 0 ? args[urlFlagIndex + 1] : undefined;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
/** Hooks live on the project API (v2021-10-04), not the Content Lake query version. */
const hooksApiVersion = "2021-10-04";
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET?.trim();
const token =
  process.env.SANITY_DEPLOY_TOKEN?.trim() || process.env.SANITY_API_WRITE_TOKEN?.trim();

const siteUrl = (
  siteUrlArg ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
)
  .trim()
  .replace(/\/$/, "");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!projectId) fail("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
if (!revalidateSecret) fail("Missing SANITY_REVALIDATE_SECRET.");
if (!token) fail("Missing SANITY_DEPLOY_TOKEN or SANITY_API_WRITE_TOKEN.");
if (!siteUrl || siteUrl.includes("localhost")) {
  fail(
    "Production site URL required. Pass --url https://your-domain.com or set NEXT_PUBLIC_SITE_URL to your deployed domain.",
  );
}

const webhookUrl = `${siteUrl}/api/revalidate?secret=${encodeURIComponent(revalidateSecret)}`;

const webhookBody = {
  type: "document",
  name: WEBHOOK_NAME,
  url: webhookUrl,
  dataset,
  apiVersion: "v2021-10-04",
  httpMethod: "POST",
  rule: {
    on: ["create", "update", "delete"],
    filter: `_type in ["siteSettings","homepage","researchArea","publication","patent","person","activity"]`,
    projection: `{ _type, "slug": slug.current }`,
  },
  description:
    "Instantly revalidate the Next.js site on Vercel when CMS content is published.",
};

/** PATCH rejects `type`; create requires it. */
const { type: _webhookType, ...webhookPatchBody } = webhookBody;

const base = `https://${projectId}.api.sanity.io/v${hooksApiVersion}/hooks/projects/${projectId}`;

async function sanityRequest(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null
        ? JSON.stringify(data)
        : String(data ?? response.statusText);
    throw new Error(`Sanity API ${response.status}: ${detail}`);
  }

  return data;
}

function printManualSetup() {
  console.error("");
  console.error("Manual setup in sanity.io/manage → API → Webhooks → Create webhook:");
  console.error("");
  console.error(`  Name:        ${WEBHOOK_NAME}`);
  console.error(`  URL:         ${webhookUrl.replace(revalidateSecret, "<SANITY_REVALIDATE_SECRET>")}`);
  console.error(`  Dataset:     ${dataset}`);
  console.error("  Trigger on:  Create, Update, Delete");
  console.error(`  Filter:      ${webhookBody.rule.filter}`);
  console.error(`  Projection:  ${webhookBody.rule.projection}`);
  console.error("  HTTP method: POST");
  console.error("");
  console.error("Then ensure SANITY_REVALIDATE_SECRET is set on Vercel (Production) and redeploy.");
}

async function main() {
  console.log("Sanity instant revalidation webhook setup");
  console.log(`Project:  ${projectId}`);
  console.log(`Dataset:  ${dataset}`);
  console.log(`Target:   ${webhookUrl.replace(revalidateSecret, "***")}`);
  console.log("");

  const existing = await sanityRequest("");
  const match = Array.isArray(existing)
    ? existing.find((hook) => hook.name === WEBHOOK_NAME || hook.url?.startsWith(`${siteUrl}/api/revalidate`))
    : null;

  if (match?.id) {
    console.log(`Updating existing webhook (${match.id})…`);
    try {
      await sanityRequest(`/${match.id}`, {
        method: "PATCH",
        body: JSON.stringify(webhookPatchBody),
      });
      console.log("✓ Webhook updated.");
    } catch {
      console.log("PATCH failed, recreating webhook…");
      await sanityRequest(`/${match.id}`, { method: "DELETE" });
      await sanityRequest("", {
        method: "POST",
        body: JSON.stringify(webhookBody),
      });
      console.log("✓ Webhook recreated.");
    }
  } else {
    console.log("Creating webhook…");
    await sanityRequest("", {
      method: "POST",
      body: JSON.stringify(webhookBody),
    });
    console.log("✓ Webhook created.");
  }

  console.log("");
  console.log("Next steps:");
  console.log("1. Ensure SANITY_REVALIDATE_SECRET is set on Vercel (Production).");
  console.log("2. Publish a test change in Sanity Studio.");
  console.log("3. Check webhook deliveries in sanity.io/manage → API → Webhooks.");
}

main().catch((error) => {
  console.error("\nSetup failed:", error.message);
  console.error(
    "\nCreate a Deploy token at sanity.io/manage → API → Tokens (Developer role),",
  );
  console.error("add it as SANITY_DEPLOY_TOKEN in .env.local, and retry:");
  console.error("  npm run setup:webhook -- --url https://www.nadimchowdhury.com");
  printManualSetup();
  process.exit(1);
});
