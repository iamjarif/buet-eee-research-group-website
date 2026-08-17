import { SanityImage } from "@/components/ui/SanityImage";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { getPersonInitials } from "@/lib/people";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "../../../sanity/types";

type PersonPortraitProps = {
  name: string;
  image?: SanityImageType;
  /** Width requested from the Sanity CDN; the crop is locked to 4:5. */
  width?: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

const PORTRAIT_RATIO = 4 / 5;

/** Portraits are normalized through a consistent 4:5 hotspot-aware crop. */
export function PersonPortrait({
  name,
  image,
  width = 560,
  sizes,
  className,
  priority = false,
}: PersonPortraitProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-surface-subtle",
        className,
      )}
    >
      {image?.asset ? (
        <SanityImage
          image={image}
          alt={image.alt ?? name}
          width={width}
          height={Math.round(width / PORTRAIT_RATIO)}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700",
            hoverEaseClass,
            "group-hover:scale-[1.03] group-focus-within:scale-[1.03]",
          )}
        />
      ) : (
        <div
          aria-hidden
          className="flex h-full w-full items-center justify-center bg-surface-subtle"
        >
          <span className="font-display text-heading-md text-text-tertiary">
            {getPersonInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
}

export default PersonPortrait;
