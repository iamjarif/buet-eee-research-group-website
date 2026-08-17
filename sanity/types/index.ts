import type { PortableTextBlock } from "@portabletext/types";

/** Sanity image asset with metadata returned from GROQ queries. */
export type SanityImage = {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
      lqip?: string;
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  ogImage?: SanityImage;
};

export type Link = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type NavItem = Link;

export type SocialLink = {
  platform: string;
  url: string;
  label?: string;
};

export type SiteSettings = {
  siteName?: string;
  siteDescription?: string;
  logo?: SanityImage;
  partnerLogo?: SanityImage;
  mainNavigation?: NavItem[];
  headerCta?: Link;
  footerNavigation?: NavItem[];
  footerContent?: PortableTextBlock[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactPageDescription?: string;
  contactPrimaryName?: string;
  contactPrimaryTitle?: string;
  contactAffiliation?: string;
  contactOfficeAddress?: string;
  contactMailingAddress?: string;
  contactLocationLabel?: string;
  contactMapEmbedUrl?: string;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  defaultSeo?: SeoFields;
};

/** Roster group values defined by the `group` field on the person schema. */
export type PersonGroup = "pi" | "phd" | "msc" | "undergrad" | "alumni";

export type PersonSummary = {
  _id: string;
  name: string;
  slug: string;
  position: string;
  group?: PersonGroup;
  currentAffiliation?: string;
  photograph?: SanityImage;
  isActive?: boolean;
  displayOrder?: number;
};

/** Person fields returned by the People page roster query. */
export type PersonRosterEntry = PersonSummary & {
  biography?: PortableTextBlock[];
  researchInterests?: string[];
  email?: string;
  externalProfileLinks?: Link[];
};

export type Person = PersonRosterEntry & {
  researchAreas?: Array<{ _id: string; title: string; slug: string }>;
  seo?: SeoFields;
};

export type ResearchAreaSummary = {
  _id: string;
  title: string;
  slug: string;
  description?: PortableTextBlock[];
  image?: SanityImage;
  externalLink?: string;
  displayOrder?: number;
  isPublished?: boolean;
};

export type ResearchAreaEntry = ResearchAreaSummary & {
  publicationCount?: number;
  selectedPublications?: PublicationSummary[];
};

export type ResearchArea = ResearchAreaSummary & {
  seo?: SeoFields;
  relatedPublications?: PublicationSummary[];
  relatedPeople?: PersonSummary[];
};

export type PublicationSummary = {
  _id: string;
  title: string;
  slug: string;
  journalOrConference: string;
  publicationType?: "journal" | "conference";
  categoryLabel: string;
  year: number;
  doi?: string;
  externalUrl?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  description?: PortableTextBlock[];
  image?: SanityImage;
  authorLine?: string;
  researchAreas?: Array<{ _id: string; title: string; slug: string }>;
};

export type Publication = PublicationSummary & {
  description?: PortableTextBlock[];
  seo?: SeoFields;
};

export type PatentSummary = {
  _id: string;
  title: string;
  slug: string;
  patentNumber?: string;
  status: string;
  year: number;
  externalUrl?: string;
  displayOrder?: number;
  inventorLine?: string;
  inventors?: PersonSummary[];
  researchAreas?: Array<{ _id: string; title: string; slug: string }>;
};

export type Patent = PatentSummary & {
  description?: PortableTextBlock[];
  seo?: SeoFields;
};

export type ActivitySummary = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  description?: PortableTextBlock[];
  externalUrl?: string;
  displayOrder?: number;
  isPublished?: boolean;
  image?: SanityImage;
};

export type Activity = ActivitySummary & {
  seo?: SeoFields;
};

export type Homepage = {
  heroEyebrow?: string;
  heroHeading?: string;
  heroDescription?: string;
  heroButtons?: Link[];
  publicationsSectionHeading?: string;
  publicationsSectionDescription?: string;
  featuredPublications?: PublicationSummary[];
  researchSectionHeading?: string;
  researchSectionDescription?: string;
  featuredResearchAreas?: ResearchAreaSummary[];
  teamSectionHeading?: string;
  teamSectionDescription?: string;
  teamImage?: SanityImage;
  teamSectionLink?: Link;
  featuredTeam?: PersonSummary[];
  activitiesSectionHeading?: string;
  activitiesSectionDescription?: string;
  featuredActivities?: ActivitySummary[];
  joinUsHeading?: string;
  joinUsDescription?: PortableTextBlock[];
  joinUsButton?: Link;
  seo?: SeoFields;
};

export type SitemapSlugs = {
  researchAreas: Array<{ slug: string }>;
  publications: Array<{ slug: string }>;
  patents: Array<{ slug: string }>;
  people: Array<{ slug: string }>;
  activities: Array<{ slug: string }>;
};
