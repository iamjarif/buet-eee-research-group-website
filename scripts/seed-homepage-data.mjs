/**
 * S-DREAM homepage seed data (Figma node 39:2).
 * Pure data — no Sanity mutations. Used by seed-homepage-content.mjs.
 */

/** All deterministic document IDs owned by this seed. Nothing outside this list is touched. */
export const SEED_DOCUMENT_IDS = [
  "siteSettings",
  "homepage",
  "researchArea-gan-rf-devices",
  "researchArea-gan-power-devices",
  "researchArea-device-physics-modeling",
  "researchArea-tcad-advanced-simulation",
  "publication-physics-based-reliability-modeling-gan-rf",
  "publication-buffer-induced-trapping-algan-gan-hemts",
  "publication-compact-modeling-vertical-gan-power-diodes",
  "publication-thermal-transport-limits-lateral-gan-power",
  "publication-field-plate-optimization-high-voltage-gan-hemts",
  "publication-tcad-study-dynamic-on-resistance-gan-diodes",
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
  "S-DREAM explores wide-bandgap semiconductor technology through device physics, modeling, and simulation — focused on GaN RF and power devices.";

export const SEED_IMAGE_ASSETS = [
  {
    key: "teamPhoto",
    relativePath: "assets/team-photo.png",
    filename: "s-dream-team-photo.png",
    alt: "S-DREAM research group team photo",
  },
  {
    key: "partnerLogo",
    relativePath: "assets/partner-logo.png",
    filename: "s-dream-partner-logo.png",
    alt: "Bangladesh University of Engineering and Technology logo",
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
  return [
    {
      _id: "researchArea-gan-rf-devices",
      _type: "researchArea",
      title: "GaN RF Devices",
      slug: { _type: "slug", current: "gan-rf-devices" },
      description: [
        block(
          "High-frequency AlGaN/GaN devices for wireless, radar, and other RF applications.",
          "desc",
        ),
      ],
      displayOrder: 0,
      isPublished: true,
    },
    {
      _id: "researchArea-gan-power-devices",
      _type: "researchArea",
      title: "GaN Power Devices",
      slug: { _type: "slug", current: "gan-power-devices" },
      description: [
        block(
          "Wide-bandgap transistor architectures for efficient power conversion and high-performance power electronics.",
          "desc",
        ),
      ],
      displayOrder: 1,
      isPublished: true,
    },
    {
      _id: "researchArea-device-physics-modeling",
      _type: "researchArea",
      title: "Device Physics & Modeling",
      slug: { _type: "slug", current: "device-physics-modeling" },
      description: [
        block(
          "Physics-based and compact modeling that connects semiconductor behavior with circuit-level design.",
          "desc",
        ),
      ],
      displayOrder: 2,
      isPublished: true,
    },
    {
      _id: "researchArea-tcad-advanced-simulation",
      _type: "researchArea",
      title: "TCAD & Advanced Simulation",
      slug: { _type: "slug", current: "tcad-advanced-simulation" },
      description: [
        block(
          "Numerical simulation of carrier transport, device behavior, and reliability.",
          "desc",
        ),
      ],
      displayOrder: 3,
      isPublished: true,
    },
  ];
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
      year: 2023,
      isFeatured: true,
      displayOrder: 0,
      researchAreas: [ref("researchArea-gan-rf-devices")],
    },
    {
      _id: "publication-buffer-induced-trapping-algan-gan-hemts",
      _type: "publication",
      title: "Buffer-Induced Trapping in AlGaN/GaN HEMTs",
      slug: { _type: "slug", current: "buffer-induced-trapping-algan-gan-hemts" },
      journalOrConference: "IEEE Trans. Electron Devices",
      year: 2023,
      isFeatured: true,
      displayOrder: 1,
      researchAreas: [ref("researchArea-gan-rf-devices")],
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
      year: 2022,
      isFeatured: true,
      displayOrder: 2,
      researchAreas: [ref("researchArea-gan-power-devices")],
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
      year: 2024,
      isFeatured: true,
      displayOrder: 3,
      researchAreas: [ref("researchArea-gan-power-devices")],
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
      year: 2023,
      isFeatured: true,
      displayOrder: 4,
      researchAreas: [ref("researchArea-gan-rf-devices")],
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
      year: 2022,
      isFeatured: true,
      displayOrder: 5,
      researchAreas: [ref("researchArea-tcad-advanced-simulation")],
    },
  ];
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
        href: "/publications",
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
      title: "S-DREAM presents work on RF reliability at a device physics workshop.",
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
    siteName: "S-DREAM",
    siteDescription:
      "A university research group at BUET advancing wide-bandgap semiconductor device research.",
    ...(partnerLogoAssetId
      ? { partnerLogo: imageField(partnerLogoAssetId, SEED_IMAGE_ASSETS[1].alt) }
      : {}),
    mainNavigation: [
      navItem("Research", "/research", "main"),
      navItem("People", "/people", "main"),
      navItem("Contributions", "/", "main"),
      navItem("News", "/activities", "main"),
      navItem("Contact", "/contact", "main"),
    ],
    headerCta: link("Join Us →", "/contact"),
    footerNavigation: [
      navItem("Research", "/research", "footer"),
      navItem("People", "/people", "footer"),
      navItem("Contributions", "/", "footer"),
      navItem("News", "/activities", "footer"),
      navItem("Contact", "/contact", "footer"),
    ],
    copyrightText: "© 2026 S-DREAM Research Group",
    defaultSeo: {
      _type: "seo",
      metaTitle: "S-DREAM — Semiconductor Device Research & Advanced Modeling",
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
  "defaultSeo",
];

export function buildHomepage({
  researchAreas,
  publications,
  contributions,
  activities,
  teamPhotoAssetId,
}) {
  return {
    _id: "homepage",
    _type: "homepage",
    heroEyebrow: "A RESEARCH GROUP",
    heroHeading: "Semiconductor Device Research\n& Advanced Modeling",
    heroDescription:
      "S-DREAM explores wide-bandgap semiconductor technology through device physics, modeling, simulation, and engineering — with a focus on Gallium Nitride devices for RF and power applications.",
    heroButtons: [
      link("Meet the Team", "/people"),
      link("Explore Research →", "/research"),
    ],
    featuredPublications: publications.map((doc) => ref(doc._id)),
    researchSectionHeading: "The physics of wide-bandgap devices, examined closely.",
    researchSectionDescription:
      "S-DREAM brings together device physics, modeling, simulation, and engineering to understand and advance next-generation semiconductor devices.",
    featuredResearchAreas: researchAreas.map((doc) => ref(doc._id)),
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
      metaTitle: "S-DREAM — Semiconductor Device Research & Advanced Modeling",
      metaDescription: SEO_META_DESCRIPTION,
    },
  };
}

export function buildAllSeedDocuments(imageAssetIds = {}) {
  const researchAreas = buildResearchAreas();
  const publications = buildPublications();
  const contributions = buildContributions();
  const activities = buildActivities();

  const collectionDocuments = [
    ...researchAreas,
    ...publications,
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
  });

  return {
    collectionDocuments,
    siteSettings,
    homepage,
    summary: {
      researchAreas: researchAreas.length,
      publications: publications.length,
      contributions: contributions.length,
      activities: activities.length,
      singletons: 2,
      totalDocuments: collectionDocuments.length + 2,
    },
  };
}
