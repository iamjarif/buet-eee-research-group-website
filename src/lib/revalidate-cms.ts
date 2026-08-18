import { revalidatePath, revalidateTag } from "next/cache";

import { CMS_TAGS } from "@/lib/cms";

const REVALIDATE_MAP: Record<string, string[]> = {
  siteSettings: [CMS_TAGS.siteSettings, CMS_TAGS.homepage],
  homepage: [CMS_TAGS.homepage],
  researchArea: [CMS_TAGS.researchAreas, CMS_TAGS.homepage],
  publication: [CMS_TAGS.publications, CMS_TAGS.homepage],
  patent: [CMS_TAGS.patents, CMS_TAGS.homepage],
  person: [CMS_TAGS.people, CMS_TAGS.homepage],
  activity: [CMS_TAGS.activities, CMS_TAGS.homepage],
};

const STATIC_PATHS = [
  "/",
  "/research",
  "/publications",
  "/patents",
  "/people",
  "/activities",
  "/contact",
] as const;

const SLUG_PATH_BY_TYPE: Record<string, string> = {
  researchArea: "/research",
  person: "/people",
  activity: "/activities",
};

export type RevalidateCmsOptions = {
  _type?: string;
  slug?: string | { current?: string };
};

function resolveSlug(slug?: string | { current?: string }): string | undefined {
  if (!slug) return undefined;
  return typeof slug === "string" ? slug : slug.current;
}

/** Invalidate tagged Sanity fetches and main site routes (App Router data cache). */
export function revalidateCmsContent({ _type, slug: slugInput }: RevalidateCmsOptions = {}) {
  const slug = resolveSlug(slugInput);
  const tags = _type ? REVALIDATE_MAP[_type] : undefined;

  if (tags) {
    for (const tag of [...new Set(tags)]) {
      revalidateTag(tag, "max");
    }

    if (slug && _type) {
      revalidateTag(`${_type}:${slug}`, "max");
    }
  } else {
    for (const tag of Object.values(CMS_TAGS)) {
      revalidateTag(tag, "max");
    }
  }

  // Bust the shared (site) layout cache (header, footer, nav from Site Settings).
  revalidatePath("/", "layout");

  for (const path of STATIC_PATHS) {
    revalidatePath(path, "page");
  }

  if (_type && slug && SLUG_PATH_BY_TYPE[_type]) {
    revalidatePath(`${SLUG_PATH_BY_TYPE[_type]}/${slug}`, "page");
  }

  return {
    revalidated: true,
    _type: _type ?? null,
    tags: tags ?? Object.values(CMS_TAGS),
    slug: slug ?? null,
    now: Date.now(),
  };
}
