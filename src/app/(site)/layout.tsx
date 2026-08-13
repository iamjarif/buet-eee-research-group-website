import type { ReactNode } from "react";

import { LenisProvider } from "@/components/providers/LenisProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { getSiteSettings } from "@/lib/cms";
import { buildDefaultMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildDefaultMetadata(settings);
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <LenisProvider>
      <div className="flex min-h-full flex-col">
        <MainLayout settings={settings}>{children}</MainLayout>
      </div>
    </LenisProvider>
  );
}
