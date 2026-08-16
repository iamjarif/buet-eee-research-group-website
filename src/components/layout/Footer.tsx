import { NavLink } from "@/components/navigation/NavLink";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Reveal } from "@/components/motion/Reveal";
import { RuleReveal } from "@/components/motion/RuleReveal";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
import {
  Stagger,
  StaggerItem,
  StaggerList,
  StaggerListItem,
} from "@/components/motion/Stagger";
import { VIEWPORT_FOOTER } from "@/lib/motion/constants";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "../../../sanity/types";

type FooterProps = {
  settings?: SiteSettings | null;
};

export function Footer({ settings }: FooterProps) {
  const siteName = settings?.siteName ?? siteConfig.name;
  const copyright =
    settings?.copyrightText ?? `© ${new Date().getFullYear()} ${siteName}`;
  const connectLink = settings?.headerCta ?? {
    label: "Join Us →",
    href: "/contact",
  };

  return (
    <footer className="mt-auto bg-surface-base">
      <RuleReveal viewport={VIEWPORT_FOOTER} />

      <Container as="div" className="space-y-10 pb-8 pt-12 sm:space-y-16 sm:pb-10 sm:pt-16 lg:pt-[72px]">
        <Stagger
          stagger={0.08}
          viewport={VIEWPORT_FOOTER}
          className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[minmax(0,508px)_1fr_1fr] lg:gap-14"
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
                <StaggerList className="space-y-3" stagger={0.05}>
                  {settings.footerNavigation.map((item) => (
                    <StaggerListItem key={`${item.href}-${item.label}`}>
                      <NavLink
                        item={item}
                        className="text-label-xs text-text-secondary hover:text-text-primary"
                      />
                    </StaggerListItem>
                  ))}
                </StaggerList>
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
                  <StaggerList className="space-y-3" stagger={0.05}>
                    {settings.socialLinks.map((link) => (
                      <StaggerListItem key={link.url}>
                        <a
                          href={link.url}
                          className="text-label-xs text-text-secondary transition-colors hover:text-text-primary hover:opacity-80"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label ?? link.platform}
                        </a>
                      </StaggerListItem>
                    ))}
                  </StaggerList>
                </nav>
              ) : null}
            </div>
          </StaggerItem>
        </Stagger>

        <div>
          <RuleReveal viewport={VIEWPORT_FOOTER} />

          <Reveal variant="fadeUpSubtle" delay={0.08} viewport={VIEWPORT_FOOTER}>
            <div className="flex flex-col gap-3 pt-7 text-caption text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
              <p>{siteConfig.organization}</p>
              <p>{copyright}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
