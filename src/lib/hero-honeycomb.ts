import type { SanityImage } from "../../sanity/types";

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

export type HeroHoneycombNode = {
  position: HeroHoneycombPosition;
  label: string;
  slug: string;
  image?: SanityImage;
};

type DefaultHeroHoneycombNode = HeroHoneycombNode & {
  fallbackImage?: string;
};

export const DEFAULT_HERO_HONEYCOMB_NODES: DefaultHeroHoneycombNode[] = [
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

export function resolveHeroHoneycombNodes(
  cmsNodes?: HeroHoneycombNode[],
): DefaultHeroHoneycombNode[] {
  const cmsByPosition = new Map(
    (cmsNodes ?? [])
      .filter((node) => HERO_HONEYCOMB_POSITIONS.includes(node.position))
      .map((node) => [node.position, node]),
  );

  return DEFAULT_HERO_HONEYCOMB_NODES.map((defaults) => {
    const cmsNode = cmsByPosition.get(defaults.position);
    if (!cmsNode) return defaults;

    return {
      ...defaults,
      label: cmsNode.label || defaults.label,
      slug: cmsNode.slug || defaults.slug,
      image: cmsNode.image,
    };
  });
}

export function heroHoneycombNodesByGrid(
  nodes: DefaultHeroHoneycombNode[],
): Map<string, DefaultHeroHoneycombNode> {
  return new Map(
    nodes.map((node) => [HERO_HONEYCOMB_GRID[node.position], node]),
  );
}
