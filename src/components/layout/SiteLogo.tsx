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
  header: "h-[36px] sm:h-[44px] lg:h-[48px]",
  footer: "h-[36px] sm:h-[44px]",
} as const;

const PARTNER_LOGO_HEIGHT = {
  header: "h-[32px] sm:h-[40px] lg:h-[46px]",
  footer: "h-[32px] sm:h-[42px]",
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
        "inline-flex min-w-0 max-w-full items-center gap-2 sm:gap-3 focus-visible:outline-none",
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
            "w-auto max-w-[min(52vw,11rem)] shrink-0 object-contain sm:max-w-none",
            GROUP_LOGO_HEIGHT[size],
          )}
        />

      {partnerLogo ? (
        <>
          <span
            aria-hidden
            className={cn(
              "w-px shrink-0 bg-border-strong",
              size === "header" ? "h-5 sm:h-7" : "h-5 sm:h-6",
            )}
          />
          <SanityImage
            image={partnerLogo}
            alt={partnerLogo.alt ?? "Partner institution logo"}
            width={size === "header" ? 180 : 160}
            height={size === "header" ? 46 : 42}
            className={cn(
              "w-auto max-w-[min(28vw,5.5rem)] object-contain sm:max-w-[7.5rem] lg:max-w-none",
              PARTNER_LOGO_HEIGHT[size],
            )}
            sizes="(max-width: 640px) 88px, 180px"
          />
        </>
      ) : null}
    </Link>
  );
}

export default SiteLogo;
