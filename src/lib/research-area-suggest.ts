export type ResearchAreaRecord = {
  _id: string;
  title: string;
};

const RF_ID = "researchArea-gan-rf-devices";
const POWER_ID = "researchArea-gan-power-devices";
const PHYSICS_ID = "researchArea-device-physics-modeling";
const TCAD_ID = "researchArea-tcad-advanced-simulation";

/** Keyword rules from OpenAlex topic strings → existing researchArea document IDs. */
const TOPIC_RULES: Array<{ pattern: RegExp; areaIds: string[] }> = [
  { pattern: /radio frequency|\brf\b/i, areaIds: [RF_ID] },
  { pattern: /\bpower\b|dc-dc|converter/i, areaIds: [POWER_ID] },
  { pattern: /\bgan\b|gallium nitride/i, areaIds: [RF_ID, POWER_ID] },
  { pattern: /physics|modeling|modelling|transport/i, areaIds: [PHYSICS_ID] },
  { pattern: /tcad|simulation|\bcad\b|dtco/i, areaIds: [TCAD_ID] },
];

const TITLE_RF = /\brf\b|radio frequency|linearity|microwave|mmwave|field plate/i;
const TITLE_POWER = /\bpower\b|vertical|\bkv\b|diode|switching|finfet/i;
const TITLE_PHYSICS = /physics|transport|trap|hole|barrier|fermi|compact model/i;
const TITLE_TCAD = /tcad|simulation|\bcad\b|dtco|inverse design|self consistent/i;

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
 * Map OpenAlex topic names (plus title keywords to split GaN RF vs Power)
 * onto existing researchArea documents. Returns [] when nothing is close.
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

  if (ids.includes(RF_ID) && ids.includes(POWER_ID)) {
    const rf = TITLE_RF.test(title);
    const power = TITLE_POWER.test(title);
    if (rf && !power) ids = ids.filter((id) => id !== POWER_ID);
    if (power && !rf) ids = ids.filter((id) => id !== RF_ID);
  }

  if (TITLE_PHYSICS.test(title)) ids.push(PHYSICS_ID);
  if (TITLE_TCAD.test(title)) ids.push(TCAD_ID);

  return idsInCatalog(uniqueIds(ids), catalog);
}

export function toSuggestedResearchAreaRefs(areaIds: string[]) {
  return areaIds.map((id) => ({
    _key: `suggest-${id}`,
    _type: "reference" as const,
    _ref: id,
  }));
}
