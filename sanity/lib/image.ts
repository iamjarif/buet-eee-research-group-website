import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { client } from "./client";

const builder = createImageUrlBuilder(client);

export type ImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  auto?: "format";
};

/**
 * Builds a Sanity CDN image URL with optional transformations.
 */
export function urlFor(source: SanityImageSource, options: ImageOptions = {}): string {
  let imageBuilder = builder.image(source);

  if (options.width) {
    imageBuilder = imageBuilder.width(options.width);
  }
  if (options.height) {
    imageBuilder = imageBuilder.height(options.height);
  }
  if (options.quality) {
    imageBuilder = imageBuilder.quality(options.quality);
  }
  if (options.fit) {
    imageBuilder = imageBuilder.fit(options.fit);
  }

  imageBuilder = imageBuilder.auto(options.auto ?? "format");

  return imageBuilder.url();
}

/**
 * Returns responsive srcSet widths for Next.js Image or native img elements.
 */
export function getImageSrcSet(
  source: SanityImageSource,
  widths: number[] = [320, 640, 960, 1280, 1920],
): string {
  return widths.map((width) => `${urlFor(source, { width })} ${width}w`).join(", ");
}

export { builder };
