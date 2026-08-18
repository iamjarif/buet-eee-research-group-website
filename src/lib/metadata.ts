import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { SeoFields, SiteSettings } from "../../sanity/types";
import { urlFor } from "../../sanity/lib/image";

type BuildMetadataOptions = {
  title?: string;
  description?: string;
  seo?: SeoFields;
  siteSettings?: SiteSettings | null;
  path?: string;
  type?: "website" | "article" | "profile";
  absoluteTitle?: boolean;
  index?: boolean;
};

function absoluteUrl(path = ""): string {
  const normalized = path === "/" ? "" : path;
  return new URL(normalized || "/", siteConfig.url).toString();
}

/**
 * Builds Next.js Metadata from CMS SEO fields with sensible fallbacks.
 * Page titles are strings so the root layout `title.template` can apply.
 */
export function buildMetadata({
  title,
  description,
  seo,
  siteSettings,
  path = "",
  type = "website",
  absoluteTitle = false,
  index = true,
}: BuildMetadataOptions): Metadata {
  const siteName = siteSettings?.siteName ?? siteConfig.name;
  const defaultDescription = siteSettings?.siteDescription ?? siteConfig.description;

  const pageTitle = seo?.metaTitle ?? title;
  const pageDescription = seo?.metaDescription ?? description ?? defaultDescription;
  const canonicalUrl = absoluteUrl(path);
  const displayTitle = pageTitle
    ? absoluteTitle
      ? pageTitle
      : siteConfig.titleTemplate.replace("%s", pageTitle)
    : siteConfig.defaultTitle;

  const ogImageSource = seo?.ogImage ?? siteSettings?.defaultSeo?.ogImage;
  const ogImageUrl = ogImageSource
    ? urlFor(ogImageSource, { width: 1200, height: 630 })
    : `${siteConfig.url}${siteConfig.defaultOgImage}`;
  const ogImageAlt = ogImageSource?.alt ?? siteName;

  const shouldIndex =
    index && !seo?.noIndex && !siteSettings?.defaultSeo?.noIndex;

  const metadata: Metadata = {
    title: absoluteTitle && pageTitle ? { absolute: pageTitle } : pageTitle,
    description: pageDescription,
    applicationName: siteName,
    authors: [{ name: siteConfig.principalInvestigator, url: siteConfig.url }],
    creator: siteConfig.principalInvestigator,
    publisher: siteConfig.organization,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: displayTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: pageDescription,
      images: [ogImageUrl],
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };

  return metadata;
}

export function buildDefaultMetadata(siteSettings?: SiteSettings | null): Metadata {
  const siteName = siteSettings?.siteName ?? siteConfig.name;
  const description = siteSettings?.siteDescription ?? siteConfig.description;

  return {
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description,
    applicationName: siteName,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      siteName,
      locale: siteConfig.locale,
      type: "website",
    },
  };
}
