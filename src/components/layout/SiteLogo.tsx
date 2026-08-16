import Image from "next/image";
import Link from "next/link";

import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "../../../sanity/types";

const LOGO_SRC = "/images/nc-group-logo.png";

/** Intrinsic dimensions of the original NC Group logo file. */
const LOGO_WIDTH = 745;
const LOGO_HEIGHT = 305;

type SiteLogoProps = {
  siteName?: string;
  partnerLogo?: SanityImageType;
  className?: string;
  href?: string;
  size?: "header" | "footer";
};

const GROUP_LOGO_HEIGHT = {
  header: "h-[44px] sm:h-[48px]",
  footer: "h-[40px] sm:h-[44px]",
} as const;

const PARTNER_LOGO_HEIGHT = {
  header: "h-[40px] sm:h-[46px]",
  footer: "h-[38px] sm:h-[42px]",
} as const;

export function SiteLogo({
  siteName = "NC Group",
  partnerLogo,
  className,
  href = "/",
  size = "header",
}: SiteLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 focus-visible:outline-none",
        className,
      )}
      aria-label={`${siteName} home`}
    >
        <Image
          src={LOGO_SRC}
          alt={`${siteName} logo`}
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority={size === "header"}
          unoptimized
          className={cn(
            "w-auto max-w-none shrink-0 object-contain",
            GROUP_LOGO_HEIGHT[size],
          )}
        />

      {partnerLogo ? (
        <>
          <span
            aria-hidden
            className={cn(
              "w-px shrink-0 bg-border-strong",
              size === "header" ? "h-6 sm:h-7" : "h-5 sm:h-6",
            )}
          />
          <SanityImage
            image={partnerLogo}
            alt={partnerLogo.alt ?? "Partner institution logo"}
            width={size === "header" ? 180 : 160}
            height={size === "header" ? 46 : 42}
            className={cn("w-auto object-contain", PARTNER_LOGO_HEIGHT[size])}
            sizes="180px"
          />
        </>
      ) : null}
    </Link>
  );
}

export default SiteLogo;
