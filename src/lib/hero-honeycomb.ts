import type { ResearchAreaSummary, SanityImage } from "../../sanity/types";

export const HERO_HONEYCOMB_POSITIONS = [
  "fabrication",
  "device-physics",
  "ai-hardware",
  "modeling-simulation",
  "3d-ic",
  "circuits",
] as const;

export type HeroHoneycombPosition = (typeof HERO_HONEYCOMB_POSITIONS)[number];

/** Maps Sanity position keys to honeycomb grid coordinates. */
export const HERO_HONEYCOMB_GRID: Record<HeroHoneycombPosition, string> = {
  fabrication: "2,1",
  "device-physics": "3,1",
  "ai-hardware": "2,2",
  "modeling-simulation": "4,2",
  "3d-ic": "2,3",
  circuits: "3,3",
};

/** Fallback slug when heroPosition is missing on a research area document. */
export const RESEARCH_AREA_SLUG_TO_HERO_POSITION: Record<string, HeroHoneycombPosition> = {
  fabrication: "fabrication",
  "device-physics": "device-physics",
  "ai-hardware-design": "ai-hardware",
  "device-physics-modeling": "modeling-simulation",
  "3d-ic": "3d-ic",
  circuits: "circuits",
};

export type HeroHoneycombResearchArea = Pick<
  ResearchAreaSummary,
  "title" | "slug" | "image"
> & {
  heroPosition?: HeroHoneycombPosition;
};

type ResolvedHeroHoneycombNode = {
  position: HeroHoneycombPosition;
  label: string;
  slug: string;
  image?: SanityImage;
  fallbackImage?: string;
};

export const DEFAULT_HERO_HONEYCOMB_NODES: ResolvedHeroHoneycombNode[] = [
  {
    position: "fabrication",
    label: "Fabrication",
    slug: "fabrication",
    fallbackImage: "/images/hero/hex-fabrication.png",
  },
  {
    position: "device-physics",
    label: "Device Physics",
    slug: "device-physics",
    fallbackImage: "/images/hero/hex-device-physics.png",
  },
  {
    position: "ai-hardware",
    label: "AI Hardware",
    slug: "ai-hardware-design",
  },
  {
    position: "modeling-simulation",
    label: "Modeling &\nSimulation",
    slug: "device-physics-modeling",
    fallbackImage: "/images/hero/hex-modeling-simulation.png",
  },
  {
    position: "3d-ic",
    label: "3D-IC",
    slug: "3d-ic",
    fallbackImage: "/images/hero/hex-3d-ic.png",
  },
  {
    position: "circuits",
    label: "Circuits",
    slug: "circuits",
    fallbackImage: "/images/hero/hex-circuits.png",
  },
];

/** Split long titles across two lines in hero hex labels (e.g. "Modeling & Simulation"). */
export function formatHeroHoneycombLabel(title: string): string {
  if (title.includes(" & ")) {
    return title.replace(" & ", " &\n");
  }
  return title;
}

function heroPositionForArea(area: HeroHoneycombResearchArea): HeroHoneycombPosition | undefined {
  if (area.heroPosition && HERO_HONEYCOMB_POSITIONS.includes(area.heroPosition)) {
    return area.heroPosition;
  }
  return RESEARCH_AREA_SLUG_TO_HERO_POSITION[area.slug];
}

/** Build hero hex nodes from research area documents (title, slug, image). */
export function resolveHeroHoneycombNodesFromResearchAreas(
  researchAreas?: HeroHoneycombResearchArea[],
): ResolvedHeroHoneycombNode[] {
  const byPosition = new Map<HeroHoneycombPosition, HeroHoneycombResearchArea>();

  for (const area of researchAreas ?? []) {
    const position = heroPositionForArea(area);
    if (position) byPosition.set(position, area);
  }

  return DEFAULT_HERO_HONEYCOMB_NODES.map((defaults) => {
    const area = byPosition.get(defaults.position);
    if (!area) return defaults;

    return {
      ...defaults,
      label: formatHeroHoneycombLabel(area.title),
      slug: area.slug,
      image: area.image,
    };
  });
}

export function heroHoneycombNodesByGrid(
  nodes: ResolvedHeroHoneycombNode[],
): Map<string, ResolvedHeroHoneycombNode> {
  return new Map(nodes.map((node) => [HERO_HONEYCOMB_GRID[node.position], node]));
}
