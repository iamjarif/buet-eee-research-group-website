import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { hoverEaseClass } from "@/lib/motion/transitions";
import {
  getContactLocationLabel,
  getContactMapEmbedUrl,
  getMailingAddressLines,
  splitContactLines,
} from "@/lib/contact-page";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "../../../sanity/types";

const contactLinkClassName = cn(
  "text-body-md text-brand-primary transition-opacity duration-300",
  hoverEaseClass,
  "hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

function AddressLines({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {lines.map((line, index) => (
        <p key={`${line}-${index}`}>{line}</p>
      ))}
    </div>
  );
}

type ContactIdentityBarProps = {
  settings?: SiteSettings | null;
};

export function ContactIdentityBar({ settings }: ContactIdentityBarProps) {
  const affiliation = splitContactLines(settings?.contactAffiliation);

  return (
    <Reveal immediate variant="fadeUpSubtle">
      <div className="border-b border-border-default bg-surface-subtle py-8">
        <Container as="div">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div className="space-y-2">
              {settings?.contactPrimaryName ? (
                <p className="font-display text-heading-md text-text-primary">
                  {settings.contactPrimaryName}
                </p>
              ) : null}

              {settings?.contactPrimaryTitle ? (
                <p className="text-body-sm text-text-secondary">
                  {settings.contactPrimaryTitle}
                </p>
              ) : null}

              {affiliation.length > 0 ? (
                <AddressLines
                  lines={affiliation}
                  className="text-body-sm text-text-secondary"
                />
              ) : null}
            </div>

            <div className="flex shrink-0 flex-col gap-6 sm:flex-row sm:gap-14">
              {settings?.contactEmail ? (
                <div className="space-y-1.5">
                  <p className="type-overline text-text-tertiary">Email</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className={cn(contactLinkClassName, "break-all")}
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              ) : null}

              {settings?.contactPhone ? (
                <div className="space-y-1.5">
                  <p className="type-overline text-text-tertiary">Phone</p>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}
                    className={contactLinkClassName}
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </Reveal>
  );
}

type ContactLocationProps = {
  settings?: SiteSettings | null;
  className?: string;
};

export function ContactLocation({ settings, className }: ContactLocationProps) {
  const officeLines = splitContactLines(settings?.contactOfficeAddress);
  const mailingLines = getMailingAddressLines(settings);
  const legacyAddress = splitContactLines(settings?.contactAddress);
  const locationLabel = getContactLocationLabel(settings);
  const mapEmbedUrl = getContactMapEmbedUrl(settings);
  const addressLines =
    officeLines.length > 0 ? officeLines : legacyAddress.length > 0 ? legacyAddress : [];

  return (
    <div className={cn("space-y-7", className)}>
      {addressLines.length > 0 ? (
        <div className="space-y-1.5">
          <p className="type-overline text-text-tertiary">Office</p>
          <AddressLines
            lines={addressLines}
            className="text-body-md text-text-secondary"
          />
        </div>
      ) : null}

      {mailingLines.length > 0 ? (
        <div className="space-y-1.5">
          <p className="type-overline text-text-tertiary">Mailing address</p>
          <AddressLines
            lines={mailingLines}
            className="text-body-md text-text-secondary"
          />
        </div>
      ) : null}

      <div>
        <div className="overflow-hidden border border-border-default">
          <iframe
            title={`Map showing ${locationLabel}`}
            src={mapEmbedUrl}
            className="aspect-[3/2] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="mt-3 text-caption text-text-tertiary">{locationLabel}</p>
      </div>
    </div>
  );
}
