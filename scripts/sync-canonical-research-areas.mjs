#!/usr/bin/env node
/**
 * Upsert the six canonical research areas, remap legacy references, delete extras,
 * and remove featuredResearchAreas from the homepage singleton.
 *
 * Usage:
 *   node --env-file=.env.local scripts/sync-canonical-research-areas.mjs
 *   node --env-file=.env.local scripts/sync-canonical-research-areas.mjs --apply
 */

import { createClient } from "@sanity/client";

import {
  CANONICAL_RESEARCH_AREAS,
  LEGACY_RESEARCH_AREA_ID_MAP,
  descriptionParagraphsForSlug,
} from "./data/canonical-research-areas.mjs";

const apply = process.argv.includes("--apply");

const REF_FIELDS_BY_TYPE = {
  publication: ["researchAreas", "suggestedResearchAreas"],
  patent: ["researchAreas"],
  person: ["researchAreas"],
  homepage: ["featuredResearchAreas"],
};

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

function buildSlugToCanonicalId() {
  const map = new Map();
  for (const area of CANONICAL_RESEARCH_AREAS) {
    map.set(area.slug, area._id);
  }
  return map;
}

function resolveResearchAreaRef(refId, { canonicalIds, slugById, slugToCanonicalId }) {
  if (!refId) return null;

  if (canonicalIds.has(refId)) return refId;

  const legacyId = LEGACY_RESEARCH_AREA_ID_MAP[refId];
  if (legacyId && canonicalIds.has(legacyId)) return legacyId;

  const slug = slugById.get(refId);
  if (slug) {
    const bySlug = slugToCanonicalId.get(slug);
    if (bySlug) return bySlug;
  }

  return null;
}

function mapResearchAreaRefs(refs, context) {
  if (!Array.isArray(refs)) return refs;

  const mapped = refs
    .map((entry) => {
      const refId = entry?._ref;
      const nextId = resolveResearchAreaRef(refId, context);
      if (!nextId) return null;
      return { ...entry, _ref: nextId };
    })
    .filter(Boolean);

  const seen = new Set();
  return mapped.filter((entry) => {
    if (seen.has(entry._ref)) return false;
    seen.add(entry._ref);
    return true;
  });
}

function patchDocumentFields(document, context) {
  const fields = REF_FIELDS_BY_TYPE[document._type] ?? [];
  const patch = {};

  for (const field of fields) {
    if (!Array.isArray(document[field])) continue;
    const nextRefs = mapResearchAreaRefs(document[field], context);
    if (JSON.stringify(document[field]) !== JSON.stringify(nextRefs)) {
      patch[field] = nextRefs;
    }
  }

  return Object.keys(patch).length > 0 ? patch : null;
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

  const canonicalIds = new Set(CANONICAL_RESEARCH_AREAS.map((area) => area._id));
  const slugToCanonicalId = buildSlugToCanonicalId();

  const existingAreas = await client.fetch(
    `*[_type == "researchArea"]{ _id, title, "slug": slug.current }`,
  );
  const slugById = new Map(existingAreas.map((area) => [area._id, area.slug]));
  const context = { canonicalIds, slugById, slugToCanonicalId };

  const extraAreaIds = existingAreas
    .map((area) => area._id)
    .filter((id) => !canonicalIds.has(id));

  const referringDocs = await client.fetch(
    `*[
      _type in ["publication", "patent", "person", "homepage"]
      && (
        count(researchAreas[@._ref in $extraIds]) > 0
        || count(suggestedResearchAreas[@._ref in $extraIds]) > 0
        || count(featuredResearchAreas[@._ref in $extraIds]) > 0
        || defined(researchAreas)
        || defined(suggestedResearchAreas)
        || defined(featuredResearchAreas)
      )
    ]{
      _id,
      _type,
      title,
      name,
      researchAreas,
      suggestedResearchAreas,
      featuredResearchAreas
    }`,
    { extraIds: [...extraAreaIds, ...Object.keys(LEGACY_RESEARCH_AREA_ID_MAP)] },
  );

  const docsToPatch = referringDocs
    .map((document) => {
      const patch = patchDocumentFields(document, context);
      if (!patch) return null;
      return { id: document._id, type: document._type, title: document.title ?? document.name ?? document._id, patch };
    })
    .filter(Boolean);

  console.log("Canonical research areas to upsert:");
  for (const area of CANONICAL_RESEARCH_AREAS) {
    console.log(`  • ${area.title} (${area.slug})`);
  }

  if (extraAreaIds.length > 0) {
    console.log(`\nExtra research areas to delete (${extraAreaIds.length}):`);
    for (const id of extraAreaIds) {
      const match = existingAreas.find((area) => area._id === id);
      console.log(`  • ${match?.title ?? id}`);
    }
  } else {
    console.log("\nNo extra research areas found.");
  }

  if (docsToPatch.length > 0) {
    console.log(`\nDocuments to remap (${docsToPatch.length}):`);
    for (const document of docsToPatch) {
      console.log(`  • [${document.type}] ${document.title}`);
    }
  }

  console.log("\nHomepage: unset featuredResearchAreas (section uses all published areas in code).");

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to write to Sanity.");
    return;
  }

  let tx = client.transaction();

  for (const area of CANONICAL_RESEARCH_AREAS) {
    const description = toPortableText(descriptionParagraphsForSlug(area.slug));
    tx = tx.createOrReplace({
      _id: area._id,
      _type: "researchArea",
      title: area.title,
      slug: { _type: "slug", current: area.slug },
      description,
      displayOrder: area.displayOrder,
      isPublished: true,
    });
  }

  for (const document of docsToPatch) {
    tx = tx.patch(document.id, (patch) => patch.set(document.patch));
  }

  for (const homepageId of ["homepage", "drafts.homepage"]) {
    tx = tx.patch(homepageId, (patch) => patch.unset(["featuredResearchAreas"]));
  }

  await tx.commit();
  console.log("\nPhase 1 complete: upserted areas and remapped references.");

  if (extraAreaIds.length === 0) {
    console.log("No extra research areas to delete.");
    return;
  }

  let deleteTx = client.transaction();
  for (const id of extraAreaIds) {
    deleteTx = deleteTx.delete(id);
  }
  await deleteTx.commit();
  console.log(`Phase 2 complete: deleted ${extraAreaIds.length} extra research area(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
