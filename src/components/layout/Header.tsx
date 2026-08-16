import { HeaderShell } from "@/components/layout/HeaderShell";
import { HeaderMotion, HeaderMotionItem } from "@/components/motion/HeaderMotion";
import { MobileNav } from "@/components/navigation/MobileNav";
import { NavLink } from "@/components/navigation/NavLink";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "../../../sanity/types";

type HeaderProps = {
  settings?: SiteSettings | null;
};

export function Header({ settings }: HeaderProps) {
  const siteName = settings?.siteName ?? siteConfig.name;
  const navigation = settings?.mainNavigation ?? [];
  const headerCta = settings?.headerCta ?? {
    label: "Join Us →",
    href: "/contact",
  };

  return (
    <HeaderShell>
      <Container
        as="div"
        className="flex h-[var(--layout-header-height)] items-center justify-between py-2 sm:py-3"
      >
        <HeaderMotion className="flex min-w-0 w-full items-center justify-between gap-3">
          <HeaderMotionItem className="min-w-0 shrink">
            <SiteLogo
              siteName={siteName}
              partnerLogo={settings?.partnerLogo}
              size="header"
            />
          </HeaderMotionItem>

          {/* Controls stay outside motion items so the menu toggle is clickable immediately. */}
          <div className="relative z-50 flex shrink-0 items-center gap-3 sm:gap-6 lg:gap-8 xl:gap-10">
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center gap-6 xl:gap-10">
                {navigation.length > 0 ? (
                  navigation.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <NavLink item={item} className="text-body-xs" />
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="text-body-xs text-text-muted">
                      Navigation pending CMS setup
                    </span>
                  </li>
                )}
              </ul>
            </nav>

            {headerCta.href ? (
              <LinkButton
                href={headerCta.href}
                external={headerCta.openInNewTab}
                size="sm"
                className="hidden px-3.5 py-1.5 lg:inline-flex"
              >
                {headerCta.label}
                {!headerCta.label.includes("→") ? " →" : ""}
              </LinkButton>
            ) : null}

            <MobileNav navigation={navigation} headerCta={headerCta} />
          </div>
        </HeaderMotion>
      </Container>
    </HeaderShell>
  );
}

export default Header;
