#!/usr/bin/env node
/**
 * Update researchArea description fields in Sanity from scripts/data/research-area-descriptions.mjs
 *
 * Usage:
 *   node --env-file=.env.local scripts/update-research-area-descriptions.mjs
 *   node --env-file=.env.local scripts/update-research-area-descriptions.mjs --apply
 */

import { createClient } from "@sanity/client";

import { RESEARCH_AREA_DESCRIPTIONS } from "./data/research-area-descriptions.mjs";

const apply = process.argv.includes("--apply");

function block(text, key = "desc") {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

function toPortableText(paragraphs) {
  return paragraphs.map((text, index) => block(text, `desc-${index}`));
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

  const areas = await client.fetch(
    `*[_type == "researchArea"]{ _id, title, "slug": slug.current, description }`,
  );

  const updates = [];

  for (const area of areas) {
    const nextParagraphs = RESEARCH_AREA_DESCRIPTIONS[area.slug];
    if (!nextParagraphs) {
      console.warn(`No description defined for slug "${area.slug}" (${area.title}) — skipped.`);
      continue;
    }

    const currentText = (area.description ?? [])
      .map((entry) => entry.children?.map((child) => child.text).join(""))
      .join("\n")
      .trim();

    const nextText = nextParagraphs.join("\n").trim();

    if (currentText === nextText) {
      console.log(`= ${area.title}: unchanged`);
      continue;
    }

    updates.push({
      id: area._id,
      title: area.title,
      slug: area.slug,
      nextText,
      description: toPortableText(nextParagraphs),
    });
  }

  if (updates.length === 0) {
    console.log("\nNo updates needed.");
    return;
  }

  console.log(`\n${updates.length} research area(s) to update:\n`);
  for (const update of updates) {
    console.log(`• ${update.title} (${update.slug})`);
    console.log(`  ${update.nextText}\n`);
  }

  if (!apply) {
    console.log("Dry run only. Re-run with --apply to write to Sanity.");
    return;
  }

  let tx = client.transaction();
  for (const update of updates) {
    tx = tx.patch(update.id, (patch) => patch.set({ description: update.description }));
  }
  await tx.commit();

  console.log(`Applied ${updates.length} update(s) to Sanity.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
