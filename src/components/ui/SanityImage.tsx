import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";

import { cn } from "@/lib/utils";
import { urlFor, type ImageOptions } from "../../../sanity/lib/image";
import type { SanityImage } from "../../../sanity/types";

type SanityImageProps = {
  image?: SanityImage | SanityImageSource;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  decorative?: boolean;
  fill?: boolean;
  fit?: ImageOptions["fit"];
};

export function SanityImageComponent({
  image,
  alt,
  width = 800,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  decorative = false,
  fill = false,
  fit,
}: SanityImageProps) {
  if (!image || (typeof image === "object" && !("asset" in image && image.asset))) {
    return null;
  }

  const resolvedAlt = decorative
    ? ""
    : (alt ?? (typeof image === "object" && "alt" in image ? image.alt : "") ?? "");

  const aspectHeight =
    height ??
    (typeof image === "object" &&
    "asset" in image &&
    image.asset?.metadata?.dimensions?.aspectRatio
      ? Math.round(width / image.asset.metadata.dimensions.aspectRatio)
      : Math.round(width * 0.75));

  const src = urlFor(image, {
    width,
    ...(fit === "max" || fit === "min" ? {} : { height: aspectHeight }),
    fit,
    quality: 80,
  });
  const blurDataURL =
    typeof image === "object" && "asset" in image
      ? image.asset?.metadata?.lqip
      : undefined;

  if (fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        className={cn(!className?.includes("object-") && "object-cover", className)}
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        quality={80}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={resolvedAlt}
      width={width}
      height={aspectHeight}
      className={cn("h-auto max-w-full", className)}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      quality={80}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}

export { SanityImageComponent as SanityImage };
export default SanityImageComponent;
