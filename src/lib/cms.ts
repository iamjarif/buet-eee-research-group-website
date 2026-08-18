import { cache } from "react";

import { sanityFetch } from "../../sanity/lib/client";
import {
  activityBySlugQuery,
  allActivitiesQuery,
  allPatentsQuery,
  allPeopleQuery,
  allPublicationsQuery,
  allResearchAreasQuery,
  contributionCountsQuery,
  homepageQuery,
  patentBySlugQuery,
  personBySlugQuery,
  publicationBySlugQuery,
  recentPublicationsQuery,
  researchAreaBySlugQuery,
  siteSettingsQuery,
  sitemapSlugsQuery,
} from "../../sanity/lib/queries";
import type {
  Activity,
  ActivitySummary,
  Homepage,
  Patent,
  PatentSummary,
  Person,
  PersonRosterEntry,
  Publication,
  PublicationSummary,
  ResearchArea,
  ResearchAreaEntry,
  SiteSettings,
  SitemapSlugs,
} from "../../sanity/types";
import { safeCmsFetch } from "@/lib/errors";
import type { ContributionCounts } from "@/lib/contributions";

const CMS_TAGS = {
  siteSettings: "siteSettings",
  homepage: "homepage",
  researchAreas: "researchAreas",
  publications: "publications",
  patents: "patents",
  people: "people",
  activities: "activities",
} as const;

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return safeCmsFetch(
    () =>
      sanityFetch<SiteSettings | null>({
        query: siteSettingsQuery,
        tags: [CMS_TAGS.siteSettings],
      }),
    { label: "getSiteSettings" },
  );
});

export const getHomepage = cache(async (): Promise<Homepage | null> => {
  return safeCmsFetch(
    () =>
      sanityFetch<Homepage | null>({
        query: homepageQuery,
        tags: [
          CMS_TAGS.homepage,
          CMS_TAGS.publications,
          CMS_TAGS.researchAreas,
          CMS_TAGS.people,
          CMS_TAGS.activities,
          CMS_TAGS.patents,
        ],
      }),
    { label: "getHomepage" },
  );
});

export const getResearchAreas = cache(async (): Promise<ResearchAreaEntry[]> => {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<ResearchAreaEntry[]>({
          query: allResearchAreasQuery,
          tags: [CMS_TAGS.researchAreas],
        }),
      { label: "getResearchAreas", fallback: [] },
    )) ?? []
  );
});

export const getResearchAreaBySlug = cache(
  async (slug: string): Promise<ResearchArea | null> => {
    return safeCmsFetch(
      () =>
        sanityFetch<ResearchArea | null>({
          query: researchAreaBySlugQuery,
          params: { slug },
          tags: [CMS_TAGS.researchAreas, `researchArea:${slug}`],
        }),
      { label: `getResearchAreaBySlug(${slug})` },
    );
  },
);

export const getPublications = cache(async (): Promise<PublicationSummary[]> => {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<PublicationSummary[]>({
          query: allPublicationsQuery,
          tags: [CMS_TAGS.publications],
        }),
      { label: "getPublications", fallback: [] },
    )) ?? []
  );
});

export const getRecentPublications = cache(
  async (): Promise<PublicationSummary[]> => {
    return (
      (await safeCmsFetch(
        () =>
          sanityFetch<PublicationSummary[]>({
            query: recentPublicationsQuery,
            tags: [CMS_TAGS.publications],
          }),
        { label: "getRecentPublications", fallback: [] },
      )) ?? []
    );
  },
);

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<Publication | null>({
        query: publicationBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.publications, `publication:${slug}`],
      }),
    { label: `getPublicationBySlug(${slug})` },
  );
}

export const getContributionCounts = cache(
  async (): Promise<ContributionCounts> => {
    return (
      (await safeCmsFetch(
        () =>
          sanityFetch<ContributionCounts>({
            query: contributionCountsQuery,
            tags: [CMS_TAGS.publications, CMS_TAGS.patents],
          }),
        {
          label: "getContributionCounts",
          fallback: { publications: 0, patents: 0 },
        },
      )) ?? { publications: 0, patents: 0 }
    );
  },
);

export const getPatents = cache(async (): Promise<PatentSummary[]> => {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<PatentSummary[]>({
          query: allPatentsQuery,
          tags: [CMS_TAGS.patents],
        }),
      { label: "getPatents", fallback: [] },
    )) ?? []
  );
});

export async function getPatentBySlug(slug: string): Promise<Patent | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<Patent | null>({
        query: patentBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.patents, `patent:${slug}`],
      }),
    { label: `getPatentBySlug(${slug})` },
  );
}

export const getPeople = cache(async (): Promise<PersonRosterEntry[]> => {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<PersonRosterEntry[]>({
          query: allPeopleQuery,
          tags: [CMS_TAGS.people],
        }),
      { label: "getPeople", fallback: [] },
    )) ?? []
  );
});

export const getPersonBySlug = cache(async (slug: string): Promise<Person | null> => {
  return safeCmsFetch(
    () =>
      sanityFetch<Person | null>({
        query: personBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.people, `person:${slug}`],
      }),
    { label: `getPersonBySlug(${slug})` },
  );
});

export const getActivities = cache(async (): Promise<ActivitySummary[]> => {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<ActivitySummary[]>({
          query: allActivitiesQuery,
          tags: [CMS_TAGS.activities],
        }),
      { label: "getActivities", fallback: [] },
    )) ?? []
  );
});

export const getActivityBySlug = cache(
  async (slug: string): Promise<Activity | null> => {
    return safeCmsFetch(
      () =>
        sanityFetch<Activity | null>({
          query: activityBySlugQuery,
          params: { slug },
          tags: [CMS_TAGS.activities, `activity:${slug}`],
        }),
      { label: `getActivityBySlug(${slug})` },
    );
  },
);

export async function getSitemapSlugs(): Promise<SitemapSlugs> {
  return (
    (await safeCmsFetch(
      () =>
        sanityFetch<SitemapSlugs>({
          query: sitemapSlugsQuery,
          tags: [
            CMS_TAGS.researchAreas,
            CMS_TAGS.publications,
            CMS_TAGS.patents,
            CMS_TAGS.people,
            CMS_TAGS.activities,
          ],
        }),
      {
        label: "getSitemapSlugs",
        fallback: {
          researchAreas: [],
          publications: [],
          patents: [],
          people: [],
          activities: [],
        },
      },
    )) ?? {
      researchAreas: [],
      publications: [],
      patents: [],
      people: [],
      activities: [],
    }
  );
}

export { CMS_TAGS };
