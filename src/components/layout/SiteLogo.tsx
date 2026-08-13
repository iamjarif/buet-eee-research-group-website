import Link from "next/link";

import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "../../../sanity/types";

type SiteLogoProps = {
  siteName?: string;
  partnerLogo?: SanityImageType;
  className?: string;
  href?: string;
  size?: "header" | "footer";
};

export function SiteLogo({
  siteName = "S-DREAM",
  partnerLogo,
  className,
  href = "/",
  size = "header",
}: SiteLogoProps) {
  const wordmarkClass =
    size === "header" ? "text-label-md font-medium" : "text-label-sm font-semibold";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 focus-visible:outline-none",
        className,
      )}
      aria-label={`${siteName} home`}
    >
      <span className={wordmarkClass}>
        <span className="text-text-primary">S</span>
        <span className="text-brand-primary">-</span>
        <span className="text-text-primary">DREAM</span>
      </span>

      {partnerLogo ? (
        <>
          <span aria-hidden className="h-[19px] w-px shrink-0 bg-border-strong" />
          <SanityImage
            image={partnerLogo}
            alt={partnerLogo.alt ?? "Partner institution logo"}
            width={size === "header" ? 149 : 132}
            height={size === "header" ? 38 : 34}
            className="h-[34px] w-auto object-contain sm:h-[38px]"
            sizes="149px"
          />
        </>
      ) : null}
    </Link>
  );
}

export default SiteLogo;
