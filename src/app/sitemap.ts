import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/research`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/publications`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/patents`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/people`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/activities`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
