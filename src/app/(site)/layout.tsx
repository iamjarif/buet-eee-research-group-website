import type { ReactNode } from "react";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/json-ld";
import { buildDefaultMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildDefaultMetadata(settings);
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <LenisProvider>
      <JsonLd data={buildOrganizationJsonLd(settings)} />
      <JsonLd data={buildWebsiteJsonLd()} />
      <div className="flex min-h-full flex-col">
        <MainLayout settings={settings}>{children}</MainLayout>
      </div>
    </LenisProvider>
  );
}
