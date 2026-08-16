/**
 * NC Group homepage seed data (Figma node 39:2).
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
  "patent-gan-hemts-field-plate-architecture",
  "patent-vertical-gan-power-diode-termination",
  "patent-semiconductor-device-vertically-stacked-gan-complementary-fets",
  "patent-compound-semiconductor-device-high-power-high-frequency",
  "patent-polarization-direction-changeable-semiconductor-device",
  "patent-high-electron-mobility-transistors-low-on-resistance",
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
      publicationType: "journal",
      categoryLabel: "J1",
      authorLine: "N. Chowdhury, A. Rahman, S. Karim",
      externalUrl: "https://doi.org/10.1109/JEDS.2023.3300001",
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
      publicationType: "journal",
      categoryLabel: "J2",
      authorLine: "N. Chowdhury, M. Hasan, T. Ahmed",
      externalUrl: "https://doi.org/10.1109/TED.2023.3300002",
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
      publicationType: "journal",
      categoryLabel: "J3",
      authorLine: "N. Chowdhury, R. Islam, K. Das",
      externalUrl: "https://doi.org/10.1109/JEDS.2022.3300003",
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
      publicationType: "journal",
      categoryLabel: "J4",
      authorLine: "N. Chowdhury, F. Khan, P. Saha",
      externalUrl: "https://doi.org/10.1063/5.3300004",
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
      publicationType: "journal",
      categoryLabel: "J5",
      authorLine: "N. Chowdhury, S. Karim, A. Rahman",
      externalUrl: "https://doi.org/10.1109/LED.2023.3300005",
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
      publicationType: "journal",
      categoryLabel: "J6",
      authorLine: "N. Chowdhury, M. Hasan, R. Islam",
      externalUrl: "https://doi.org/10.1088/1361-6641/3300006",
      year: 2022,
      isFeatured: true,
      displayOrder: 5,
      researchAreas: [ref("researchArea-tcad-advanced-simulation")],
    },
  ];
}

export function buildPatents() {
  return [
    {
      _id: "patent-gan-hemts-field-plate-architecture",
      _type: "patent",
      title: "Semiconductor device with vertically stacked GaN complementary FETs",
      slug: {
        _type: "slug",
        current: "semiconductor-device-vertically-stacked-gan-complementary-fets",
      },
      patentNumber: "US12501699B1",
      status: "granted",
      year: 2025,
      externalUrl: "https://patents.google.com/patent/US12501699B1",
      displayOrder: 0,
      researchAreas: [ref("researchArea-gan-rf-devices")],
    },
    {
      _id: "patent-vertical-gan-power-diode-termination",
      _type: "patent",
      title: "Compound semiconductor device for high power and high frequency operation",
      slug: {
        _type: "slug",
        current: "compound-semiconductor-device-high-power-high-frequency",
      },
      patentNumber: "US20250294864A1",
      status: "granted",
      year: 2025,
      externalUrl: "https://patents.google.com/patent/US20250294864A1",
      displayOrder: 1,
      researchAreas: [ref("researchArea-gan-power-devices")],
    },
    {
      _id: "patent-semiconductor-device-vertically-stacked-gan-complementary-fets",
      _type: "patent",
      title: "High electron mobility transistors with low specific on-resistance",
      slug: {
        _type: "slug",
        current: "high-electron-mobility-transistors-low-specific-on-resistance-granted",
      },
      patentNumber: "US20250203907A1",
      status: "granted",
      year: 2025,
      externalUrl: "https://patents.google.com/patent/US20250203907A1",
      displayOrder: 2,
      researchAreas: [ref("researchArea-gan-power-devices")],
    },
    {
      _id: "patent-compound-semiconductor-device-high-power-high-frequency",
      _type: "patent",
      title: "Artificial intelligence assisted design and fabrication of semiconductor devices",
      slug: {
        _type: "slug",
        current: "artificial-intelligence-assisted-design-fabrication-semiconductor-devices",
      },
      patentNumber: "US20250307491A1",
      status: "granted",
      year: 2025,
      externalUrl: "https://patents.google.com/patent/US20250307491A1",
      displayOrder: 3,
      researchAreas: [ref("researchArea-tcad-advanced-simulation")],
    },
    {
      _id: "patent-polarization-direction-changeable-semiconductor-device",
      _type: "patent",
      title: "Semiconductor Device with a Changeable Polarization Direction",
      slug: {
        _type: "slug",
        current: "semiconductor-device-changeable-polarization-direction",
      },
      patentNumber: "US PATENT APP. 18/052,776",
      status: "pending",
      year: 2025,
      inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
      externalUrl: "https://patents.google.com/",
      displayOrder: 0,
      researchAreas: [ref("researchArea-gan-rf-devices")],
    },
    {
      _id: "patent-high-electron-mobility-transistors-low-on-resistance",
      _type: "patent",
      title: "High Electron Mobility Transistors with Low Specific On-Resistance",
      slug: {
        _type: "slug",
        current: "high-electron-mobility-transistors-low-specific-on-resistance",
      },
      patentNumber: "US PATENT APP. 18/537,865",
      status: "pending",
      year: 2025,
      inventorLine: "Koon Hoo Teo, Nadim Chowdhury",
      externalUrl: "https://patents.google.com/",
      displayOrder: 1,
      researchAreas: [ref("researchArea-gan-power-devices")],
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

export function buildHomepage({
  researchAreas,
  publications,
  activities,
  teamPhotoAssetId,
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
    featuredPublications: publications.map((doc) => ref(doc._id)),
    researchSectionHeading: "The physics of wide-bandgap devices, examined closely.",
    researchSectionDescription:
      "NC Group brings together device physics, modeling, simulation, and engineering to understand and advance next-generation semiconductor devices.",
    featuredResearchAreas: researchAreas.map((doc) => ref(doc._id)),
    teamSectionHeading: "The people behind the research.",
    teamSectionDescription:
      "Our group is dedicated to advancing the field of Wide Bandgap (WBG) semiconductor technology, with a specific focus on Gallium Nitride (GaN) devices. We specialize in the development of GaN RF and power devices, leveraging the unique properties of GaN to create high-performance solutions.",
    ...(teamPhotoAssetId
      ? { teamImage: imageField(teamPhotoAssetId, SEED_IMAGE_ASSETS[0].alt) }
      : {}),
    teamSectionLink: link("Meet the whole team →", "/people"),
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
  const activities = buildActivities();

  const collectionDocuments = [
    ...researchAreas,
    ...publications,
    ...patents,
    ...activities,
  ];

  const siteSettings = buildSiteSettings(imageAssetIds.partnerLogo);
  const homepage = buildHomepage({
    researchAreas,
    publications,
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
      patents: patents.length,
      activities: activities.length,
      singletons: 2,
      totalDocuments: collectionDocuments.length + 2,
    },
  };
}
