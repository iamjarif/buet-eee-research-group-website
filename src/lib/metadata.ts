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
};

/**
 * Builds Next.js Metadata from CMS SEO fields with sensible fallbacks.
 */
export function buildMetadata({
  title,
  description,
  seo,
  siteSettings,
  path = "",
  type = "website",
}: BuildMetadataOptions): Metadata {
  const siteName = siteSettings?.siteName ?? siteConfig.name;
  const defaultDescription = siteSettings?.siteDescription ?? siteConfig.description;

  const pageTitle = seo?.metaTitle ?? title;
  const pageDescription = seo?.metaDescription ?? description ?? defaultDescription;

  const canonicalUrl = new URL(path, siteConfig.url).toString();

  const ogImageSource = seo?.ogImage ?? siteSettings?.defaultSeo?.ogImage;
  const ogImageUrl = ogImageSource
    ? urlFor(ogImageSource, { width: 1200, height: 630 })
    : undefined;

  const metadata: Metadata = {
    title: pageTitle
      ? { default: pageTitle, template: `%s | ${siteName}` }
      : { default: siteName, template: `%s | ${siteName}` },
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: pageTitle ?? siteName,
      description: pageDescription,
      url: canonicalUrl,
      siteName,
      locale: siteConfig.locale,
      type,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogImageSource?.alt ?? siteName,
          },
        ],
      }),
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title: pageTitle ?? siteName,
      description: pageDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots:
      seo?.noIndex || siteSettings?.defaultSeo?.noIndex
        ? { index: false, follow: false }
        : { index: true, follow: true },
  };

  return metadata;
}

export function buildDefaultMetadata(siteSettings?: SiteSettings | null): Metadata {
  return buildMetadata({ siteSettings, path: "/" });
}
