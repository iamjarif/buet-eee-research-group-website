import { siteConfig } from "@/config/site";
import { getPublicationExternalUrl } from "@/lib/publications";
import type {
  PersonRosterEntry,
  PublicationSummary,
  SiteSettings,
} from "../../sanity/types";

function absoluteUrl(path = "/"): string {
  return new URL(path === "/" ? "/" : path, siteConfig.url).toString();
}

export function buildOrganizationJsonLd(settings?: SiteSettings | null) {
  const name = settings?.siteName ?? siteConfig.name;
  const description = settings?.siteDescription ?? siteConfig.description;
  const email = settings?.contactEmail?.trim();
  const sameAs = (settings?.socialLinks ?? [])
    .map((link) => link.url)
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name,
    alternateName: ["S-DREAM"],
    url: siteConfig.url,
    description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.organization,
    },
    ...(email ? { email } : {}),
    ...(settings?.contactOfficeAddress || settings?.contactAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress:
              settings.contactOfficeAddress ?? settings.contactAddress,
            addressLocality: "Dhaka",
            addressCountry: "BD",
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: {
      "@type": "ResearchOrganization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function buildPersonJsonLd(person: PersonRosterEntry) {
  const sameAs = (person.externalProfileLinks ?? [])
    .map((link) => link.href)
    .filter((href) => href.startsWith("http"));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.position,
    url: absoluteUrl("/people"),
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.organization,
    },
    ...(person.email ? { email: person.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildPublicationsJsonLd(publications: PublicationSummary[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NC Group publications",
    itemListElement: publications.slice(0, 50).map((publication, index) => {
      const url = getPublicationExternalUrl(publication);
      const doiUrl = publication.doi
        ? publication.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
        : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ScholarlyArticle",
          headline: publication.highlightTitle?.trim() || publication.title,
          name: publication.title,
          ...(publication.authorLine
            ? { author: publication.authorLine.split(/,\s*/).map((name) => ({
                "@type": "Person",
                name,
              })) }
            : {}),
          datePublished: String(publication.year),
          isPartOf: {
            "@type": "Periodical",
            name: publication.journalOrConference,
          },
          ...(doiUrl ? { identifier: `https://doi.org/${doiUrl}` } : {}),
          ...(url ? { url } : {}),
        },
      };
    }),
  };
}
