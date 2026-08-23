/**
 * The six research areas shown in the hero honeycomb. Single source of truth for
 * seed data, Sanity sync, and publication filter slugs.
 */

import { RESEARCH_AREA_DESCRIPTIONS } from "./research-area-descriptions.mjs";

/** @typedef {{ _id: string; title: string; slug: string; displayOrder: number }} CanonicalResearchArea */

/** @type {CanonicalResearchArea[]} */
export const CANONICAL_RESEARCH_AREAS = [
  {
    _id: "researchArea-fabrication",
    title: "Fabrication",
    slug: "fabrication",
    displayOrder: 0,
  },
  {
    _id: "researchArea-device-physics",
    title: "Device Physics",
    slug: "device-physics",
    displayOrder: 1,
  },
  {
    _id: "researchArea-ai-hardware-design",
    title: "AI Hardware",
    slug: "ai-hardware-design",
    displayOrder: 2,
  },
  {
    _id: "researchArea-modeling-simulation",
    title: "Modeling & Simulation",
    slug: "device-physics-modeling",
    displayOrder: 3,
  },
  {
    _id: "researchArea-3d-ic",
    title: "3D-IC",
    slug: "3d-ic",
    displayOrder: 4,
  },
  {
    _id: "researchArea-circuits",
    title: "Circuits",
    slug: "circuits",
    displayOrder: 5,
  },
];

/** Maps legacy seed / OpenAlex IDs to canonical research area IDs. */
export const LEGACY_RESEARCH_AREA_ID_MAP = {
  "researchArea-gan-rf-devices": "researchArea-device-physics",
  "researchArea-gan-power-devices": "researchArea-device-physics",
  "researchArea-device-physics-modeling": "researchArea-modeling-simulation",
  "researchArea-tcad-advanced-simulation": "researchArea-modeling-simulation",
};

export function descriptionParagraphsForSlug(slug) {
  return RESEARCH_AREA_DESCRIPTIONS[slug] ?? [];
}
