"use client";

import type { PortableTextBlock } from "@portabletext/types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { transitionUI } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";

/** Includes the word after “contributions” so truncation lands on that phrase. */
const SECOND_PARAGRAPH_TEASER_LENGTH = 53;

type ExpandableBiographyProps = {
  value: PortableTextBlock[];
  className?: string;
};

function getBiographyParagraphs(value: PortableTextBlock[]): string[] {
  return value
    .flatMap((block) =>
      block._type === "block" && Array.isArray(block.children)
        ? block.children.map((child) => ("text" in child ? child.text : "")).join("")
        : [],
    )
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");

  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd();
}

const bodyClassName = "text-body-md text-text-secondary";

const buttonClassName =
  "text-text-secondary underline decoration-1 underline-offset-2 transition-colors hover:text-text-primary";

export function ExpandableBiography({ value, className }: ExpandableBiographyProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const reduced = useReducedMotion();
  const paragraphs = getBiographyParagraphs(value);
  const isExpandable = paragraphs.length > 1;

  if (!isExpandable) {
    return <PortableTextContent value={value} className={className} />;
  }

  const [firstParagraph, secondParagraph, ...restParagraphs] = paragraphs;
  const secondParagraphTeaser = truncateAtWord(
    secondParagraph,
    SECOND_PARAGRAPH_TEASER_LENGTH,
  );
  const secondParagraphTruncated =
    secondParagraphTeaser.length < secondParagraph.length;

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: transitionUI,
      };

  return (
    <motion.div
      layout={!reduced}
      className={cn("space-y-4", className)}
      transition={reduced ? undefined : transitionUI}
    >
      <div id={contentId} aria-expanded={expanded} className="overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.div key="expanded" {...motionProps}>
              <PortableTextContent value={value} />
            </motion.div>
          ) : (
            <motion.div key="collapsed" className="space-y-4" {...motionProps}>
              <p className={bodyClassName}>{firstParagraph}</p>
              {secondParagraphTruncated ? (
                <p className={bodyClassName}>
                  {secondParagraphTeaser}
                  …{" "}
                  <button
                    type="button"
                    className={buttonClassName}
                    aria-controls={contentId}
                    onClick={() => setExpanded(true)}
                  >
                    read more
                  </button>
                </p>
              ) : (
                <p className={bodyClassName}>{secondParagraph}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="read-less"
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: transitionUI,
                })}
          >
            <button
              type="button"
              className={cn(buttonClassName, "text-label-xs")}
              aria-controls={contentId}
              onClick={() => setExpanded(false)}
            >
              read less
            </button>
          </motion.div>
        ) : !secondParagraphTruncated && restParagraphs.length > 0 ? (
          <motion.div
            key="read-more"
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: transitionUI,
                })}
          >
            <button
              type="button"
              className={cn(buttonClassName, "text-label-xs")}
              aria-controls={contentId}
              onClick={() => setExpanded(true)}
            >
              … read more
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default ExpandableBiography;
