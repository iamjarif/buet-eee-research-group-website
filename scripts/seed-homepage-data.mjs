/**
 * NC Group homepage seed data (Figma node 39:2).
 * Pure data — no Sanity mutations. Used by seed-homepage-content.mjs.
 */

import { buildCvPatents } from "./data/cv-patents.mjs";
import {
  CANONICAL_RESEARCH_AREAS,
  descriptionParagraphsForSlug,
} from "./data/canonical-research-areas.mjs";

/** All deterministic document IDs owned by this seed. Nothing outside this list is touched. */
export const SEED_DOCUMENT_IDS = [
  "siteSettings",
  "homepage",
  "researchArea-fabrication",
  "researchArea-device-physics",
  "researchArea-ai-hardware-design",
  "researchArea-modeling-simulation",
  "researchArea-3d-ic",
  "researchArea-circuits",
  "publication-physics-based-reliability-modeling-gan-rf",
  "publication-buffer-induced-trapping-algan-gan-hemts",
  "publication-compact-modeling-vertical-gan-power-diodes",
  "publication-thermal-transport-limits-lateral-gan-power",
  "publication-field-plate-optimization-high-voltage-gan-hemts",
  "publication-tcad-study-dynamic-on-resistance-gan-diodes",
  "patent-us12520516b2",
  "patent-us12501699b1",
  "patent-us20250294864a1",
  "patent-us20250203907a1",
  "patent-us20250307491a1",
  "patent-us12113061",
  "patent-us11869946b2",
  "patent-us20240136121a1",
  "patent-us11973134b2",
  "patent-us11152471b1",
  "patent-us10886393b2",
  "patent-us10910480b2",
  "patent-us10622960b2",
  "patent-us10879368b2",
  "patent-us10658501b2",
  "patent-us10276704b1",
  "patent-us-patent-app-18-052-776",
  "patent-us-patent-app-18-523-477",
  "patent-us-patent-app-18-537-865",
  "contribution-publications",
  "contribution-patents-innovations",
  "contribution-recognition",
  "activity-vertical-gan-power-diodes-edl",
  "activity-rf-reliability-device-physics-workshop",
  "activity-welcomes-graduate-researchers",
  "activity-open-compact-model-library",
];

/** Max 160 chars — matches sanity/schemas/objects/seo.ts validation. */
const SEO_META_DESCRIPTION =
  "NC Group explores wide-bandgap semiconductor technology through device physics, modeling, and simulation — focused on GaN RF and power devices.";

export const SEED_IMAGE_ASSETS = [
  {
    key: "teamPhoto",
    relativePath: "assets/team-photo.png",
    filename: "s-dream-team-photo.png",
    alt: "NC Group research group team photo",
  },
  {
    key: "partnerLogo",
    relativePath: "assets/partner-logo.png",
    filename: "s-dream-partner-logo.png",
    alt: "Bangladesh University of Engineering and Technology logo",
  },
  {
    key: "heroHexFabrication",
    relativePath: "assets/hex-fabrication.png",
    filename: "hero-hex-fabrication.png",
    alt: "Semiconductor fabrication layers diagram",
  },
  {
    key: "heroHexDevicePhysics",
    relativePath: "assets/hex-device-physics.png",
    filename: "hero-hex-device-physics.png",
    alt: "Device physics transistor cross-section",
  },
  {
    key: "heroHexModelingSimulation",
    relativePath: "assets/hex-modeling-simulation.png",
    filename: "hero-hex-modeling-simulation.png",
    alt: "Modeling and simulation charts",
  },
  {
    key: "heroHex3dIc",
    relativePath: "assets/hex-3d-ic.png",
    filename: "hero-hex-3d-ic.png",
    alt: "3D integrated circuit stack illustration",
  },
  {
    key: "heroHexCircuits",
    relativePath: "assets/hex-circuits.png",
    filename: "hero-hex-circuits.png",
    alt: "Circuit layout diagrams",
  },
];

function block(text, key) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
  };
}

/** Stable _key for array items (Sanity requires _key on every array entry). */
function arrayKey(prefix) {
  return prefix.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 64);
}

function ref(id) {
  return {
    _key: arrayKey(`ref-${id}`),
    _type: "reference",
    _ref: id,
    _weak: false,
  };
}

function navItem(label, href, scope) {
  return {
    _key: arrayKey(`${scope}-nav-${href || "root"}`),
    _type: "navItem",
    label,
    href,
  };
}

function link(label, href) {
  return {
    _key: arrayKey(`link-${href || label}`),
    _type: "link",
    label,
    href,
  };
}

function imageField(assetId, alt) {
  if (!assetId) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

export function buildResearchAreas() {
  return CANONICAL_RESEARCH_AREAS.map((area) => {
    const paragraphs = descriptionParagraphsForSlug(area.slug);
    return {
      _id: area._id,
      _type: "researchArea",
      title: area.title,
      slug: { _type: "slug", current: area.slug },
      description: paragraphs.map((text, index) => block(text, `desc-${index}`)),
      displayOrder: area.displayOrder,
      isPublished: true,
    };
  });
}

export function buildPublications() {
  return [
    {
      _id: "publication-physics-based-reliability-modeling-gan-rf",
      _type: "publication",
      title: "Physics-Based Reliability Modeling for GaN RF Devices",
      slug: {
        _type: "slug",
        current: "physics-based-reliability-modeling-gan-rf-devices",
      },
      journalOrConference: "IEEE J. Electron Devices Soc.",
      publicationType: "journal",
      authorLine: "N. Chowdhury, A. Rahman, S. Karim",
      externalUrl: "https://doi.org/10.1109/JEDS.2023.3300001",
      year: 2023,
      isFeatured: true,
      displayOrder: 0,
      researchAreas: [ref("researchArea-device-physics")],
    },
    {
      _id: "publication-buffer-induced-trapping-algan-gan-hemts",
      _type: "publication",
      title: "Buffer-Induced Trapping in AlGaN/GaN HEMTs",
      slug: { _type: "slug", current: "buffer-induced-trapping-algan-gan-hemts" },
      journalOrConference: "IEEE Trans. Electron Devices",
      publicationType: "journal",
      authorLine: "N. Chowdhury, M. Hasan, T. Ahmed",
      externalUrl: "https://doi.org/10.1109/TED.2023.3300002",
      year: 2023,
      isFeatured: true,
      displayOrder: 1,
      researchAreas: [ref("researchArea-device-physics")],
    },
    {
      _id: "publication-compact-modeling-vertical-gan-power-diodes",
      _type: "publication",
      title: "Compact Modeling of Vertical GaN Power Diodes",
      slug: {
        _type: "slug",
        current: "compact-modeling-vertical-gan-power-diodes",
      },
      journalOrConference: "IEEE J. Electron Devices Soc.",
      publicationType: "journal",
      authorLine: "N. Chowdhury, R. Islam, K. Das",
      externalUrl: "https://doi.org/10.1109/JEDS.2022.3300003",
      year: 2022,
      isFeatured: true,
      displayOrder: 2,
      researchAreas: [ref("researchArea-modeling-simulation")],
    },
    {
      _id: "publication-thermal-transport-limits-lateral-gan-power",
      _type: "publication",
      title: "Thermal Transport Limits in Lateral GaN Power Transistors",
      slug: {
        _type: "slug",
        current: "thermal-transport-limits-lateral-gan-power-transistors",
      },
      journalOrConference: "Journal of Applied Physics",
      publicationType: "journal",
      authorLine: "N. Chowdhury, F. Khan, P. Saha",
      externalUrl: "https://doi.org/10.1063/5.3300004",
      year: 2024,
      isFeatured: true,
      displayOrder: 3,
      researchAreas: [ref("researchArea-device-physics")],
    },
    {
      _id: "publication-field-plate-optimization-high-voltage-gan-hemts",
      _type: "publication",
      title: "Field-Plate Optimization for High-Voltage GaN HEMTs",
      slug: {
        _type: "slug",
        current: "field-plate-optimization-high-voltage-gan-hemts",
      },
      journalOrConference: "IEEE Electron Device Letters",
      publicationType: "journal",
      authorLine: "N. Chowdhury, S. Karim, A. Rahman",
      externalUrl: "https://doi.org/10.1109/LED.2023.3300005",
      year: 2023,
      isFeatured: true,
      displayOrder: 4,
      researchAreas: [ref("researchArea-device-physics")],
    },
    {
      _id: "publication-tcad-study-dynamic-on-resistance-gan-diodes",
      _type: "publication",
      title: "TCAD Study of Dynamic On-Resistance in GaN Diodes",
      slug: {
        _type: "slug",
        current: "tcad-study-dynamic-on-resistance-gan-diodes",
      },
      journalOrConference: "Semiconductor Science and Technology",
      publicationType: "journal",
      authorLine: "N. Chowdhury, M. Hasan, R. Islam",
      externalUrl: "https://doi.org/10.1088/1361-6641/3300006",
      year: 2022,
      isFeatured: true,
      displayOrder: 5,
      researchAreas: [ref("researchArea-modeling-simulation")],
    },
  ];
}

export function buildPatents() {
  return buildCvPatents();
}

export function buildContributions() {
  return [
    {
      _id: "contribution-publications",
      _type: "contribution",
      label: "Publications",
      value: "12+",
      description:
        "Peer-reviewed journal and conference papers on GaN devices and modeling.",
      link: {
        _type: "link",
        label: "Browse Publications →",
        href: "/publications",
      },
      displayOrder: 0,
    },
    {
      _id: "contribution-patents-innovations",
      _type: "contribution",
      label: "Patents & Innovations",
      value: "16",
      description: "Patents on device architecture for RF and power GaN.",
      link: {
        _type: "link",
        label: "View Patents →",
        href: "/patents",
      },
      displayOrder: 1,
    },
    {
      _id: "contribution-recognition",
      _type: "contribution",
      label: "Recognition",
      value: "Best Paper recognition at a device physics workshop",
      description: "2023",
      link: {
        _type: "link",
        label: "All awards →",
        href: "/activities",
      },
      displayOrder: 2,
    },
  ];
}

export function buildActivities() {
  return [
    {
      _id: "activity-vertical-gan-power-diodes-edl",
      _type: "activity",
      title: "New results on vertical GaN power diodes accepted to IEEE EDL.",
      slug: {
        _type: "slug",
        current: "vertical-gan-power-diodes-accepted-ieee-edl",
      },
      date: "2024-07-01",
      category: "publication",
      description: [
        block(
          "The group reports reduced dynamic on-resistance in vertical GaN diodes through buffer and termination engineering.",
          "desc",
        ),
      ],
      displayOrder: 0,
      isPublished: true,
    },
    {
      _id: "activity-rf-reliability-device-physics-workshop",
      _type: "activity",
      title: "NC Group presents work on RF reliability at a device physics workshop.",
      slug: {
        _type: "slug",
        current: "rf-reliability-device-physics-workshop",
      },
      date: "2024-05-01",
      category: "event",
      displayOrder: 1,
      isPublished: true,
    },
    {
      _id: "activity-welcomes-graduate-researchers",
      _type: "activity",
      title: "The group welcomes new graduate researchers to the modeling effort.",
      slug: { _type: "slug", current: "welcomes-graduate-researchers-modeling" },
      date: "2024-03-01",
      category: "news",
      displayOrder: 2,
      isPublished: true,
    },
    {
      _id: "activity-open-compact-model-library",
      _type: "activity",
      title:
        "An early version of our open compact-model library is shared for feedback.",
      slug: { _type: "slug", current: "open-compact-model-library-feedback" },
      date: "2024-01-01",
      category: "news",
      displayOrder: 3,
      isPublished: true,
    },
  ];
}

export function buildSiteSettings(partnerLogoAssetId) {
  return {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "NC Group",
    siteDescription:
      "A university research group at BUET advancing wide-bandgap semiconductor device research.",
    ...(partnerLogoAssetId
      ? { partnerLogo: imageField(partnerLogoAssetId, SEED_IMAGE_ASSETS[1].alt) }
      : {}),
    mainNavigation: [
      navItem("Research", "/research", "main"),
      navItem("People", "/people", "main"),
      navItem("Publications", "/publications", "main"),
      navItem("Patents", "/patents", "main"),
      navItem("News", "/activities", "main"),
      navItem("Contact", "/contact", "main"),
    ],
    headerCta: link("Join Us →", "/contact"),
    footerNavigation: [
      navItem("Research", "/research", "footer"),
      navItem("People", "/people", "footer"),
      navItem("Publications", "/publications", "footer"),
      navItem("Patents", "/patents", "footer"),
      navItem("News", "/activities", "footer"),
      navItem("Contact", "/contact", "footer"),
    ],
    copyrightText: "© 2026 NC Group",
    contactEmail: "nadim@eee.buet.ac.bd",
    contactPhone: "+8801730725252",
    contactPageDescription:
      "For research inquiries, collaborations, and academic correspondence, reach NC Group by email, phone, or the form below.",
    contactPrimaryName: "Dr. Nadim Chowdhury",
    contactPrimaryTitle: "Assistant Professor",
    contactAffiliation:
      "Department of Electrical and Electronic Engineering (EEE)\nBangladesh University of Engineering and Technology (BUET)\nDhaka-1205, Bangladesh",
    contactOfficeAddress:
      "Room no: ECE 130\nElectrical and Computer Engineering Building",
    contactMailingAddress: "",
    contactLocationLabel: "BUET · Dhaka, Bangladesh",
    contactMapEmbedUrl:
      "https://maps.google.com/maps?q=Bangladesh+University+of+Engineering+and+Technology+Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
    defaultSeo: {
      _type: "seo",
      metaTitle: "NC Group — Wide-bandgap semiconductor device research at BUET",
      metaDescription: SEO_META_DESCRIPTION,
    },
  };
}

/** Fields written by the seed on siteSettings. Other existing fields are preserved via patch. */
export const SITE_SETTINGS_SEED_FIELDS = [
  "siteName",
  "siteDescription",
  "partnerLogo",
  "mainNavigation",
  "headerCta",
  "footerNavigation",
  "copyrightText",
  "contactEmail",
  "contactPhone",
  "contactPageDescription",
  "contactPrimaryName",
  "contactPrimaryTitle",
  "contactAffiliation",
  "contactOfficeAddress",
  "contactMailingAddress",
  "contactLocationLabel",
  "contactMapEmbedUrl",
  "defaultSeo",
];

function heroHoneycombNode(position, label, slug, imageAssetId, imageAlt) {
  return {
    _key: arrayKey(`hero-hex-${position}`),
    _type: "heroHoneycombNode",
    position,
    label,
    slug,
    ...(imageAssetId ? { image: imageField(imageAssetId, imageAlt) } : {}),
  };
}

export function buildHomepage({
  researchAreas,
  publications,
  contributions,
  activities,
  teamPhotoAssetId,
  heroHexAssetIds = {},
}) {
  return {
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: "NC GROUP",
    heroHeading: "Wide-bandgap Semiconductor\nDevice Research",
    heroDescription:
      "NC Group explores wide-bandgap semiconductor technology through device physics, modeling, simulation, and engineering — with a focus on Gallium Nitride devices for RF and power applications.",
    heroButtons: [
      link("Meet the Team", "/people"),
      link("Explore Research →", "/research"),
    ],
    heroHoneycombNodes: [
      heroHoneycombNode(
        "fabrication",
        "Fabrication",
        "fabrication",
        heroHexAssetIds.fabrication,
        SEED_IMAGE_ASSETS[2].alt,
      ),
      heroHoneycombNode(
        "device-physics",
        "Device Physics",
        "device-physics",
        heroHexAssetIds.devicePhysics,
        SEED_IMAGE_ASSETS[3].alt,
      ),
      heroHoneycombNode("ai-hardware", "AI Hardware", "ai-hardware-design"),
      heroHoneycombNode(
        "modeling-simulation",
        "Modeling &\nSimulation",
        "device-physics-modeling",
        heroHexAssetIds.modelingSimulation,
        SEED_IMAGE_ASSETS[4].alt,
      ),
      heroHoneycombNode(
        "3d-ic",
        "3D-IC",
        "3d-ic",
        heroHexAssetIds.threeDIc,
        SEED_IMAGE_ASSETS[5].alt,
      ),
      heroHoneycombNode(
        "circuits",
        "Circuits",
        "circuits",
        heroHexAssetIds.circuits,
        SEED_IMAGE_ASSETS[6].alt,
      ),
    ],
    featuredPublications: publications.map((doc) => ref(doc._id)),
    researchSectionHeading: "The physics of wide-bandgap devices, examined closely.",
    researchSectionDescription:
      "NC Group brings together device physics, modeling, simulation, and engineering to understand and advance next-generation semiconductor devices.",
    teamSectionHeading: "The people behind the research.",
    teamSectionDescription:
      "Our group is dedicated to advancing the field of Wide Bandgap (WBG) semiconductor technology, with a specific focus on Gallium Nitride (GaN) devices. We specialize in the development of GaN RF and power devices, leveraging the unique properties of GaN to create high-performance solutions.",
    ...(teamPhotoAssetId
      ? { teamImage: imageField(teamPhotoAssetId, SEED_IMAGE_ASSETS[0].alt) }
      : {}),
    teamSectionLink: link("Meet the whole team →", "/people"),
    contributionsSectionHeading: "What the group has produced.",
    featuredContributions: contributions.map((doc) => ref(doc._id)),
    activitiesSectionHeading: "Recent activity.",
    featuredActivities: activities.map((doc) => ref(doc._id)),
    joinUsHeading: "Curious about\nsemiconductor devices?",
    joinUsDescription: [
      block(
        "We welcome students, researchers, and collaborators interested in understanding semiconductor devices deeply and contributing to meaningful research.",
        "join-desc",
      ),
    ],
    joinUsButton: link("Get in touch →", "/contact"),
    seo: {
      _type: "seo",
      metaTitle: "NC Group — Wide-bandgap semiconductor device research at BUET",
      metaDescription: SEO_META_DESCRIPTION,
    },
  };
}

export function buildAllSeedDocuments(imageAssetIds = {}) {
  const researchAreas = buildResearchAreas();
  const publications = buildPublications();
  const patents = buildPatents();
  const contributions = buildContributions();
  const activities = buildActivities();

  const collectionDocuments = [
    ...researchAreas,
    ...publications,
    ...patents,
    ...contributions,
    ...activities,
  ];

  const siteSettings = buildSiteSettings(imageAssetIds.partnerLogo);
  const homepage = buildHomepage({
    researchAreas,
    publications,
    contributions,
    activities,
    teamPhotoAssetId: imageAssetIds.teamPhoto,
    heroHexAssetIds: {
      fabrication: imageAssetIds.heroHexFabrication,
      devicePhysics: imageAssetIds.heroHexDevicePhysics,
      modelingSimulation: imageAssetIds.heroHexModelingSimulation,
      threeDIc: imageAssetIds.heroHex3dIc,
      circuits: imageAssetIds.heroHexCircuits,
    },
  });

  return {
    collectionDocuments,
    siteSettings,
    homepage,
    summary: {
      researchAreas: researchAreas.length,
      publications: publications.length,
      patents: patents.length,
      contributions: contributions.length,
      activities: activities.length,
      singletons: 2,
      totalDocuments: collectionDocuments.length + 2,
    },
  };
}
