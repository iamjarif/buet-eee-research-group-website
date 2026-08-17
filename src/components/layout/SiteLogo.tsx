import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/nc-group-logo.svg";
const INSTITUTION_LOGO_SRC = "/images/buet-logo.png";

/** Intrinsic dimensions of the NC Group wordmark SVG. */
const LOGO_WIDTH = 830;
const LOGO_HEIGHT = 305;

type SiteLogoProps = {
  siteName?: string;
  className?: string;
  href?: string;
  size?: "header" | "footer";
};

const GROUP_LOGO_HEIGHT = {
  header: "h-[34px] sm:h-[40px] lg:h-[38px]",
  footer: "h-[34px] sm:h-[40px] lg:h-[36px]",
} as const;

const INSTITUTION_LOGO_HEIGHT = {
  header: "h-[30px] sm:h-[36px] lg:h-[40px]",
  footer: "h-[30px] sm:h-[36px]",
} as const;

export function SiteLogo({
  siteName = "NC Group",
  className,
  href = "/",
  size = "header",
}: SiteLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-2.5 sm:gap-3 focus-visible:outline-none",
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
          "w-auto max-w-[min(58vw,12.5rem)] shrink-0 object-contain sm:max-w-none",
          GROUP_LOGO_HEIGHT[size],
        )}
      />

      <span
        aria-hidden
        className={cn(
          "w-px shrink-0 bg-border-strong",
          size === "header" ? "h-5 sm:h-6 lg:h-7" : "h-5 sm:h-6",
        )}
      />

      <Image
        src={INSTITUTION_LOGO_SRC}
        alt="Bangladesh University of Engineering and Technology logo"
        width={1024}
        height={1024}
        className={cn(
          "w-auto max-w-[min(24vw,4.75rem)] shrink-0 object-contain sm:max-w-[5.5rem] lg:max-w-none",
          INSTITUTION_LOGO_HEIGHT[size],
        )}
        sizes="(max-width: 640px) 76px, 160px"
      />
    </Link>
  );
}

export default SiteLogo;
