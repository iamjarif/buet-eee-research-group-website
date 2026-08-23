export type ResearchAreaRecord = {
  _id: string;
  title: string;
};

const FABRICATION_ID = "researchArea-fabrication";
const DEVICE_PHYSICS_ID = "researchArea-device-physics";
const AI_HARDWARE_ID = "researchArea-ai-hardware-design";
const MODELING_ID = "researchArea-modeling-simulation";
const THREE_D_IC_ID = "researchArea-3d-ic";
const CIRCUITS_ID = "researchArea-circuits";

/** Keyword rules from OpenAlex topic strings → canonical researchArea document IDs. */
const TOPIC_RULES: Array<{ pattern: RegExp; areaIds: string[] }> = [
  { pattern: /fabrication|process engineering|ohmic|regrowth|gate recess/i, areaIds: [FABRICATION_ID] },
  {
    pattern: /physics|transport|trap|barrier|fermi|reliability|\bgan\b|gallium nitride|\brf\b|radio frequency|\bpower\b/i,
    areaIds: [DEVICE_PHYSICS_ID],
  },
  {
    pattern: /machine learning|artificial intelligence|\bai\b|inverse design|dtco|design technology co/i,
    areaIds: [AI_HARDWARE_ID],
  },
  {
    pattern: /tcad|simulation|modeling|modelling|compact model|\bcad\b/i,
    areaIds: [MODELING_ID],
  },
  {
    pattern: /3d[- ]?ic|heterogeneous integration|interconnect|through[- ]silicon/i,
    areaIds: [THREE_D_IC_ID],
  },
  {
    pattern: /circuit|amplifier|logic|monolithic|mmic/i,
    areaIds: [CIRCUITS_ID],
  },
];

const TITLE_FABRICATION = /fabrication|ohmic|regrowth|gate recess|field plate|process/i;
const TITLE_DEVICE_PHYSICS = /physics|transport|trap|barrier|fermi|reliability|\brf\b|power|hemts?|diode/i;
const TITLE_AI_HARDWARE = /machine learning|\bai\b|inverse design|dtco|neural/i;
const TITLE_MODELING = /tcad|simulation|modeling|modelling|compact model|\bcad\b|self consistent/i;
const TITLE_3D_IC = /3d[- ]?ic|heterogeneous|interconnect|tsv/i;
const TITLE_CIRCUITS = /circuit|amplifier|logic|monolithic|mmic/i;

function uniqueIds(ids: string[]) {
  return [...new Set(ids)];
}

function idsInCatalog(ids: string[], catalog: ResearchAreaRecord[]) {
  const allowed = new Set(catalog.map((area) => area._id));
  return ids.filter((id) => allowed.has(id));
}

export function collectOpenAlexTopicNames(work: {
  primary_topic?: { display_name?: string | null } | null;
  topics?: Array<{ display_name?: string | null } | null> | null;
}): string[] {
  const names = [
    work.primary_topic?.display_name,
    ...(work.topics ?? []).map((topic) => topic?.display_name),
  ]
    .map((name) => name?.trim())
    .filter((name): name is string => Boolean(name));

  return uniqueIds(names);
}

/**
 * Map OpenAlex topic names (plus title keywords) onto canonical researchArea documents.
 * Returns [] when nothing is close.
 */
export function suggestResearchAreaIds(
  topicNames: string[],
  title: string,
  catalog: ResearchAreaRecord[],
): string[] {
  const fromTopics: string[] = [];
  for (const topic of topicNames) {
    for (const rule of TOPIC_RULES) {
      if (rule.pattern.test(topic)) fromTopics.push(...rule.areaIds);
    }
  }

  let ids = uniqueIds(fromTopics);

  if (TITLE_FABRICATION.test(title)) ids.push(FABRICATION_ID);
  if (TITLE_DEVICE_PHYSICS.test(title)) ids.push(DEVICE_PHYSICS_ID);
  if (TITLE_AI_HARDWARE.test(title)) ids.push(AI_HARDWARE_ID);
  if (TITLE_MODELING.test(title)) ids.push(MODELING_ID);
  if (TITLE_3D_IC.test(title)) ids.push(THREE_D_IC_ID);
  if (TITLE_CIRCUITS.test(title)) ids.push(CIRCUITS_ID);

  return idsInCatalog(uniqueIds(ids), catalog);
}

export function toSuggestedResearchAreaRefs(areaIds: string[]) {
  return areaIds.map((id) => ({
    _key: `suggest-${id}`,
    _type: "reference" as const,
    _ref: id,
  }));
}
