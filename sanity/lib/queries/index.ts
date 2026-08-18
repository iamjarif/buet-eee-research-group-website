import {
  activitySummaryFields,
  contributionSummaryFields,
  linkFields,
  navItemFields,
  patentSummaryFields,
  personSummaryFields,
  publicationSummaryFields,
  researchAreaSummaryFields,
  seoFields,
  socialLinkFields,
} from "./fragments";

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo {
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      },
      alt,
      hotspot,
      crop
    },
    partnerLogo {
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      },
      alt,
      hotspot,
      crop
    },
    mainNavigation[] {
      ${navItemFields}
    },
    headerCta {
      ${linkFields}
    },
    footerNavigation[] {
      ${navItemFields}
    },
    footerContent,
    contactEmail,
    contactPhone,
    contactAddress,
    contactPageDescription,
    contactPrimaryName,
    contactPrimaryTitle,
    contactAffiliation,
    contactOfficeAddress,
    contactMailingAddress,
    contactLocationLabel,
    contactMapEmbedUrl,
    socialLinks[] {
      ${socialLinkFields}
    },
    copyrightText,
    defaultSeo {
      ${seoFields}
    }
  }
`;

export const homepageQuery = /* groq */ `
  *[_type == "homepage" && _id == "homepage"][0] {
    heroEyebrow,
    heroHeading,
    heroDescription,
    heroButtons[] {
      label,
      href,
      openInNewTab
    },
    publicationsSectionHeading,
    publicationsSectionDescription,
    featuredPublications[]->{
      ${publicationSummaryFields}
    },
    researchSectionHeading,
    researchSectionDescription,
    featuredResearchAreas[]->{
      ${researchAreaSummaryFields}
    },
    teamSectionHeading,
    teamSectionDescription,
    teamImage {
      asset->{
        _id,
        url,
        metadata { dimensions, lqip }
      },
      alt,
      hotspot,
      crop
    },
    teamSectionLink {
      label,
      href,
      openInNewTab
    },
    featuredTeam[]->{
      ${personSummaryFields}
    },
    contributionsSectionHeading,
    contributionsSectionDescription,
    featuredContributions[]->{
      ${contributionSummaryFields}
    },
    activitiesSectionHeading,
    activitiesSectionDescription,
    featuredActivities[]->{
      ${activitySummaryFields}
    },
    joinUsHeading,
    joinUsDescription,
    joinUsButton {
      label,
      href,
      openInNewTab
    },
    seo {
      ${seoFields}
    }
  }
`;

export const allResearchAreasQuery = /* groq */ `
  *[_type == "researchArea" && isPublished == true] | order(displayOrder asc) {
    ${researchAreaSummaryFields},
    "publicationCount": count(*[_type == "publication" && references(^._id)]),
    "selectedPublications": *[_type == "publication" && references(^._id)]
      | order(year desc, displayOrder asc)[0...3] {
      ${publicationSummaryFields}
    },
    seo { ${seoFields} }
  }
`;

export const researchAreaBySlugQuery = /* groq */ `
  *[_type == "researchArea" && slug.current == $slug && isPublished == true][0] {
    ${researchAreaSummaryFields},
    seo { ${seoFields} },
    "relatedPublications": *[_type == "publication" && references(^._id)] | order(year desc) {
      ${publicationSummaryFields}
    },
    "relatedPeople": *[_type == "person" && references(^._id) && isActive == true] | order(displayOrder asc) {
      ${personSummaryFields}
    }
  }
`;

export const allPublicationsQuery = /* groq */ `
  *[_type == "publication"] | order(year desc, displayOrder asc) {
    ${publicationSummaryFields}
  }
`;

export const publicationBySlugQuery = /* groq */ `
  *[_type == "publication" && slug.current == $slug][0] {
    ${publicationSummaryFields},
    description,
    seo { ${seoFields} }
  }
`;

export const allPatentsQuery = /* groq */ `
  *[_type == "patent"] | order(year desc, displayOrder asc) {
    ${patentSummaryFields}
  }
`;

export const patentBySlugQuery = /* groq */ `
  *[_type == "patent" && slug.current == $slug][0] {
    ${patentSummaryFields},
    description,
    seo { ${seoFields} }
  }
`;

export const allPeopleQuery = /* groq */ `
  *[_type == "person" && isActive == true] | order(displayOrder asc, name asc) {
    ${personSummaryFields},
    biography,
    researchInterests,
    email,
    externalProfileLinks[] {
      ${linkFields}
    }
  }
`;

export const personBySlugQuery = /* groq */ `
  *[_type == "person" && slug.current == $slug && isActive == true][0] {
    ${personSummaryFields},
    biography,
    researchInterests,
    email,
    externalProfileLinks[] {
      label,
      href,
      openInNewTab
    },
    researchAreas[]->{
      _id,
      title,
      "slug": slug.current
    },
    seo { ${seoFields} }
  }
`;

export const allActivitiesQuery = /* groq */ `
  *[_type == "activity" && isPublished == true] | order(date desc) {
    ${activitySummaryFields}
  }
`;

export const activityBySlugQuery = /* groq */ `
  *[_type == "activity" && slug.current == $slug && isPublished == true][0] {
    ${activitySummaryFields},
    seo { ${seoFields} }
  }
`;

export const sitemapSlugsQuery = /* groq */ `
  {
    "researchAreas": *[_type == "researchArea" && isPublished == true]{ "slug": slug.current },
    "publications": *[_type == "publication"]{ "slug": slug.current },
    "patents": *[_type == "patent"]{ "slug": slug.current },
    "people": *[_type == "person" && isActive == true]{ "slug": slug.current },
    "activities": *[_type == "activity" && isPublished == true]{ "slug": slug.current }
  }
`;
