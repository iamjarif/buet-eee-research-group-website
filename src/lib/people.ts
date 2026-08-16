import type { Link, PersonGroup, PersonRosterEntry } from "../../sanity/types";

type PersonGroupDefinition = {
  key: PersonGroup;
  /** Section heading used on the People page. */
  title: string;
  /** Noun used in the section count label. */
  noun: { one: string; many: string };
};

export const PERSON_GROUP_ORDER = [
  "pi",
  "phd",
  "msc",
  "undergrad",
  "alumni",
] as const satisfies readonly PersonGroup[];

export const PERSON_GROUPS: Record<PersonGroup, PersonGroupDefinition> = {
  pi: {
    key: "pi",
    title: "Principal Investigator",
    noun: { one: "investigator", many: "investigators" },
  },
  phd: {
    key: "phd",
    title: "Doctoral Researchers",
    noun: { one: "researcher", many: "researchers" },
  },
  msc: {
    key: "msc",
    title: "M.Sc. Researchers",
    noun: { one: "researcher", many: "researchers" },
  },
  undergrad: {
    key: "undergrad",
    title: "Undergraduate Researchers",
    noun: { one: "researcher", many: "researchers" },
  },
  alumni: {
    key: "alumni",
    title: "Alumni",
    noun: { one: "alumnus", many: "alumni" },
  },
};

/**
 * Legacy person documents predate the `group` field, so the roster group is
 * inferred from the free-text position as a fallback.
 */
const GROUP_PATTERNS: ReadonlyArray<readonly [PersonGroup, RegExp]> = [
  ["alumni", /alumn/i],
  ["pi", /principal investigator|professor|faculty|supervisor/i],
  ["phd", /ph\.?\s?d|doctoral/i],
  ["msc", /m\.?\s?sc|master/i],
  ["undergrad", /under\s?grad|b\.?\s?sc|bachelor/i],
];

const INFERRED_GROUP_FALLBACK: PersonGroup = "msc";

function isPersonGroup(value: unknown): value is PersonGroup {
  return typeof value === "string" && value in PERSON_GROUPS;
}

export function resolvePersonGroup(person: PersonRosterEntry): PersonGroup {
  if (isPersonGroup(person.group)) return person.group;

  const position = person.position ?? "";
  for (const [group, pattern] of GROUP_PATTERNS) {
    if (pattern.test(position)) return group;
  }

  return INFERRED_GROUP_FALLBACK;
}

export type GroupedPeople = Record<PersonGroup, PersonRosterEntry[]>;

export function groupPeople(people: PersonRosterEntry[]): GroupedPeople {
  const grouped: GroupedPeople = {
    pi: [],
    phd: [],
    msc: [],
    undergrad: [],
    alumni: [],
  };

  for (const person of people) {
    grouped[resolvePersonGroup(person)].push(person);
  }

  for (const group of PERSON_GROUP_ORDER) {
    grouped[group].sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name),
    );
  }

  return grouped;
}

export function countCurrentMembers(grouped: GroupedPeople): number {
  return PERSON_GROUP_ORDER.filter((group) => group !== "alumni").reduce(
    (total, group) => total + grouped[group].length,
    0,
  );
}

/** Summary line shown beside the page eyebrow, e.g. "18 members · 3 alumni". */
export function formatPeopleStats(grouped: GroupedPeople): string {
  const current = countCurrentMembers(grouped);
  const alumni = grouped.alumni.length;

  const parts = [`${current} ${current === 1 ? "member" : "members"}`];
  if (alumni > 0) parts.push(`${alumni} alumni`);

  return parts.join(" · ");
}

export function formatGroupCount(group: PersonGroup, count: number): string {
  const { noun } = PERSON_GROUPS[group];
  return `${count} ${count === 1 ? noun.one : noun.many}`;
}

/** Initials used for the portrait fallback when no photograph exists. */
export function getPersonInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";

  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase();
}

export function formatResearchInterests(interests?: string[]): string {
  if (!interests?.length) return "";
  return interests.filter((interest) => interest.trim()).join(" · ");
}

/** Email plus external profiles, capped so roster tiles stay quiet. */
export function getPersonContactLinks(
  person: PersonRosterEntry,
  { max = 3 }: { max?: number } = {},
): Link[] {
  const links: Link[] = [];

  if (person.email?.trim()) {
    links.push({ label: "Email", href: `mailto:${person.email.trim()}` });
  }

  for (const link of person.externalProfileLinks ?? []) {
    if (link?.href?.trim() && link.label?.trim()) {
      links.push({ ...link, openInNewTab: true });
    }
  }

  return links.slice(0, max);
}

/** Secondary line for an alumnus: where they are now, falling back to their role. */
export function getAlumniDetail(person: PersonRosterEntry): string {
  return person.currentAffiliation?.trim() || person.position;
}
