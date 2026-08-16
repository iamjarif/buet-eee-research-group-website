import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/utils";
import type { SanityImage as SanityImageType } from "../../../sanity/types";

type MediaFrameProps = {
  image?: SanityImageType;
  width: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Tallest shape an image may keep before it is cropped. */
  minAspectRatio?: number;
};

/**
 * Editorial image frame for CMS images of unpredictable shape — measurement
 * plots, device micrographs, photographs. The image keeps its native aspect
 * ratio instead of being forced into a uniform crop; only unusually tall images
 * are cropped, which stops them from stretching a row far past its text. The
 * hairline keeps white-background figures from bleeding into the page.
 */
export function MediaFrame({
  image,
  width,
  sizes,
  className,
  priority = false,
  minAspectRatio = 1,
}: MediaFrameProps) {
  if (!image?.asset) return null;

  const nativeAspectRatio = image.asset.metadata?.dimensions?.aspectRatio;
  const height =
    nativeAspectRatio && nativeAspectRatio < minAspectRatio
      ? Math.round(width / minAspectRatio)
      : undefined;

  return (
    <figure
      className={cn(
        "overflow-hidden border border-border-default bg-surface-subtle",
        className,
      )}
    >
      <SanityImage
        image={image}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="w-full"
      />
    </figure>
  );
}

export default MediaFrame;
