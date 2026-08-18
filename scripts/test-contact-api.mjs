#!/usr/bin/env node
/**
 * Manual contact API tests — run while `npm run dev` is up on port 3000.
 * Usage: node --env-file=.env.local scripts/test-contact-api.mjs
 */

import { createClient } from "@sanity/client";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.CONTACT_TEST_BASE_URL ?? "http://localhost:3000";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-13";
const token =
  process.env.SANITY_API_READ_TOKEN?.trim() ||
  process.env.SANITY_API_WRITE_TOKEN?.trim();

function section(title) {
  console.log("\n" + "=".repeat(72));
  console.log(title);
  console.log("=".repeat(72));
}

function sanityClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

async function countApplications(client) {
  return client.fetch(`count(*[_type == "application"])`);
}

async function latestApplication(client, email) {
  return client.fetch(
    `*[_type == "application" && email == $email] | order(submittedAt desc)[0]`,
    { email },
  );
}

async function runTest1() {
  section("TEST 1 — Plain contact (no CV)");

  const client = sanityClient();
  const beforeCount = await countApplications(client);
  console.log(`Applications in Sanity before: ${beforeCount}`);

  const payload = {
    name: "Test User Plain",
    email: "plain-contact-test@example.com",
    subject: "Plain contact test",
    message: "This is a plain contact submission without CV attachment.",
    company: "",
  };

  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await response.json();
  console.log("HTTP status:", response.status);
  console.log("Response body:", JSON.stringify(body, null, 2));

  const afterCount = await countApplications(client);
  console.log(`Applications in Sanity after: ${afterCount}`);
  console.log(`New application created: ${afterCount > beforeCount ? "YES (unexpected)" : "NO (expected)"}`);

  return { ok: response.ok && body.success && afterCount === beforeCount, response, body };
}

async function runTest2() {
  section("TEST 2 — Application with CV");

  const client = sanityClient();
  const testEmail = "cv-application-test@example.com";
  const pdfPath = join(process.cwd(), "scripts/fixtures/test-cv.pdf");
  mkdirSync(join(process.cwd(), "scripts/fixtures"), { recursive: true });
  writeFileSync(
    pdfPath,
    "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 200 200]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF\n",
  );

  const formData = new FormData();
  formData.set("name", "Test Applicant");
  formData.set("email", testEmail);
  formData.set("subject", "Team application test");
  formData.set(
    "message",
    "I am applying to join the team. This message accompanies a test CV upload.",
  );
  formData.set("company", "");
  const pdfBuffer = readFileSync(pdfPath);
  const file = new File([pdfBuffer], "test-cv.pdf", { type: "application/pdf" });
  formData.set("cv", file);

  const response = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    body: formData,
  });

  const body = await response.json();
  console.log("HTTP status:", response.status);
  console.log("Response body:", JSON.stringify(body, null, 2));

  const doc = await latestApplication(client, testEmail);
  console.log("\nSanity application document:");
  console.log(JSON.stringify(doc, null, 2));

  if (doc?.cvUrl) {
    console.log("\nBlob URL:", doc.cvUrl);
  }

  const fieldsOk =
    doc &&
    doc.name === "Test Applicant" &&
    doc.email === testEmail &&
    doc.message?.includes("applying to join the team") &&
    doc.cvUrl &&
    doc.cvFilename === "test-cv.pdf" &&
    doc.submittedAt &&
    doc.status === "new";

  console.log(`\nSanity fields valid: ${fieldsOk ? "YES" : "NO"}`);
  console.log(`emailSent in response: ${body.emailSent === false ? "false (email skipped — expected)" : body.emailSent}`);

  return { ok: response.ok && body.success && fieldsOk, response, body, doc };
}

async function main() {
  section("ENV CHECK");
  const blob = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  const sanityWrite = process.env.SANITY_API_WRITE_TOKEN?.trim();
  const resend = process.env.RESEND_API_KEY?.trim();

  console.log("BLOB_READ_WRITE_TOKEN:", blob ? `SET (${blob.length} chars)` : "MISSING");
  console.log("SANITY_API_WRITE_TOKEN:", sanityWrite ? `SET (${sanityWrite.length} chars)` : "MISSING");
  console.log(
    "RESEND_API_KEY:",
    !resend
      ? "MISSING"
      : resend.includes("your_resend")
        ? "placeholder (email will be skipped)"
        : `SET (${resend.length} chars)`,
  );

  if (!blob || !sanityWrite) {
    console.error("\nSTOP: Required tokens missing. Set them in .env.local before testing.");
    process.exit(1);
  }

  try {
    await fetch(BASE, { method: "HEAD" });
  } catch {
    console.error(`\nSTOP: Dev server not reachable at ${BASE}. Run npm run dev first.`);
    process.exit(1);
  }

  const test1 = await runTest1();
  const test2 = await runTest2();

  section("SUMMARY");
  console.log("Test 1 (plain contact):", test1.ok ? "PASS" : "FAIL");
  console.log("Test 2 (CV application):", test2.ok ? "PASS" : "FAIL");

  process.exit(test1.ok && test2.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
