import type { PortableTextBlock } from "@portabletext/types";

/** Extract plain text from Sanity portable text blocks. */
export function portableTextToPlainText(blocks?: PortableTextBlock[] | null): string {
  if (!blocks?.length) return "";

  return blocks
    .map((block) => {
      if (block._type !== "block" || !("children" in block)) return "";
      return block.children?.map((child) => child.text ?? "").join("") ?? "";
    })
    .join("\n")
    .trim();
}
