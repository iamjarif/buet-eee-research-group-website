/**
 * GROQ query fragments shared across queries.
 * Keeps field selections consistent and DRY.
 */

export const imageFields = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      dimensions,
      lqip
    }
  },
  alt,
  hotspot,
  crop
`;

export const seoFields = /* groq */ `
  metaTitle,
  metaDescription,
  noIndex,
  ogImage {
    ${imageFields}
  }
`;

export const linkFields = /* groq */ `
  label,
  href,
  openInNewTab
`;

export const navItemFields = /* groq */ `
  label,
  href,
  openInNewTab
`;

export const socialLinkFields = /* groq */ `
  platform,
  url,
  label
`;

export const personSummaryFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  position,
  photograph {
    ${imageFields}
  },
  isActive,
  displayOrder
`;

export const researchAreaSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  description,
  image {
    ${imageFields}
  },
  externalLink,
  displayOrder,
  isPublished
`;

export const publicationSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  journalOrConference,
  year,
  doi,
  externalUrl,
  isFeatured,
  displayOrder,
  image {
    ${imageFields}
  },
  authors[]->{
    ${personSummaryFields}
  },
  researchAreas[]->{
    _id,
    title,
    "slug": slug.current
  }
`;

export const contributionSummaryFields = /* groq */ `
  _id,
  value,
  label,
  description,
  link {
    ${linkFields}
  },
  icon {
    ${imageFields}
  },
  displayOrder
`;

export const activitySummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  date,
  category,
  description,
  externalUrl,
  displayOrder,
  isPublished,
  image {
    ${imageFields}
  }
`;
