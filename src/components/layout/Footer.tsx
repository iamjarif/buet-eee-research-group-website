import { NavLink } from "@/components/navigation/NavLink";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "../../../sanity/types";

type FooterProps = {
  settings?: SiteSettings | null;
};

export function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName ?? siteConfig.name;
  const copyright =
    settings?.copyrightText ??
    `© ${new Date().getFullYear()} ${siteName} Research Group`;
  const connectLink = settings?.headerCta ?? {
    label: "Join S-DREAM",
    href: "/contact",
  };

  return (
    <footer className="mt-auto border-t border-border-default bg-surface-base">
      <Container as="div" className="space-y-16 pb-10 pt-[72px]">
        <Stagger
          stagger={0.08}
          className="grid gap-10 lg:grid-cols-[minmax(0,508px)_1fr_1fr] lg:gap-14"
        >
          <StaggerItem>
            <div className="space-y-3.5">
              <SiteLogo
                siteName={siteName}
                partnerLogo={settings?.partnerLogo}
                size="footer"
              />
              <p className="max-w-[320px] text-body-xs text-text-primary">
                {siteConfig.fullName}
              </p>
              <p className="max-w-[340px] text-caption text-text-secondary">
                {settings?.siteDescription ?? siteConfig.description}
              </p>
            </div>
          </StaggerItem>

          {settings?.footerNavigation?.length ? (
            <StaggerItem>
              <nav aria-label="Footer navigation">
                <p className="type-overline mb-5 text-text-tertiary">EXPLORE</p>
                <ul className="space-y-3">
                  {settings.footerNavigation.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <NavLink
                        item={item}
                        className="text-label-xs text-text-secondary hover:text-text-primary"
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            </StaggerItem>
          ) : null}

          <StaggerItem>
            <div>
              <p className="type-overline mb-5 text-text-tertiary">CONNECT</p>
              {connectLink.href ? (
                <TextLink href={connectLink.href} external={connectLink.openInNewTab}>
                  {connectLink.label.replace(/ →$/, "")}
                </TextLink>
              ) : null}

              {settings?.socialLinks?.length ? (
                <nav aria-label="Social links" className="mt-5">
                  <ul className="space-y-3">
                    {settings.socialLinks.map((link) => (
                      <li key={link.url}>
                        <a
                          href={link.url}
                          className="text-label-xs text-text-secondary transition-colors hover:text-text-primary hover:opacity-80"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label ?? link.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>
          </StaggerItem>
        </Stagger>

        <div className="flex flex-col gap-3 border-t border-border-default pt-7 text-caption text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.organization}</p>
          <p>{copyright}</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
