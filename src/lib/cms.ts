import { sanityFetch } from "../../sanity/lib/client";
import {
  activityBySlugQuery,
  allActivitiesQuery,
  allPatentsQuery,
  allPeopleQuery,
  allPublicationsQuery,
  allResearchAreasQuery,
  homepageQuery,
  patentBySlugQuery,
  personBySlugQuery,
  publicationBySlugQuery,
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

const CMS_TAGS = {
  siteSettings: "siteSettings",
  homepage: "homepage",
  researchAreas: "researchAreas",
  publications: "publications",
  patents: "patents",
  people: "people",
  activities: "activities",
} as const;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<SiteSettings | null>({
        query: siteSettingsQuery,
        tags: [CMS_TAGS.siteSettings],
      }),
    { label: "getSiteSettings" },
  );
}

export async function getHomepage(): Promise<Homepage | null> {
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
        ],
      }),
    { label: "getHomepage" },
  );
}

export async function getResearchAreas(): Promise<ResearchAreaEntry[]> {
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
}

export async function getResearchAreaBySlug(
  slug: string,
): Promise<ResearchArea | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<ResearchArea | null>({
        query: researchAreaBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.researchAreas, `researchArea:${slug}`],
      }),
    { label: `getResearchAreaBySlug(${slug})` },
  );
}

export async function getPublications(): Promise<PublicationSummary[]> {
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
}

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

export async function getPatents(): Promise<PatentSummary[]> {
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
}

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

export async function getPeople(): Promise<PersonRosterEntry[]> {
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
}

export async function getPersonBySlug(slug: string): Promise<Person | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<Person | null>({
        query: personBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.people, `person:${slug}`],
      }),
    { label: `getPersonBySlug(${slug})` },
  );
}

export async function getActivities(): Promise<ActivitySummary[]> {
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
}

export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  return safeCmsFetch(
    () =>
      sanityFetch<Activity | null>({
        query: activityBySlugQuery,
        params: { slug },
        tags: [CMS_TAGS.activities, `activity:${slug}`],
      }),
    { label: `getActivityBySlug(${slug})` },
  );
}

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
