import activity from "./documents/activity";
import homepage from "./documents/homepage";
import patent from "./documents/patent";
import person from "./documents/person";
import publication from "./documents/publication";
import researchArea from "./documents/researchArea";
import siteSettings from "./documents/siteSettings";
import imageWithAlt from "./objects/imageWithAlt";
import link from "./objects/link";
import navItem from "./objects/navItem";
import portableText from "./objects/portableText";
import seo from "./objects/seo";
import socialLink from "./objects/socialLink";

export const schemaTypes = [
  // Objects
  seo,
  link,
  socialLink,
  navItem,
  portableText,
  imageWithAlt,

  // Documents
  siteSettings,
  homepage,
  researchArea,
  publication,
  patent,
  person,
  activity,
];
