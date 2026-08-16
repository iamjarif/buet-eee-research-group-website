import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { FooterShell } from "@/components/layout/FooterShell";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/ui/SkipLink";
import type { SiteSettings } from "../../../sanity/types";

type MainLayoutProps = {
  children: ReactNode;
  settings?: SiteSettings | null;
};

export function MainLayout({ children, settings }: MainLayoutProps) {
  return (
    <>
      <SkipLink />
      <Header settings={settings} />
      <main id="main-content" className="flex-1 pt-[var(--layout-header-height)]">
        {children}
      </main>
      <FooterShell>
        <Footer settings={settings} />
      </FooterShell>
    </>
  );
}

export default MainLayout;
