import type { ReactNode } from "react";

type FoundationSectionProps = {
  id: string;
  heading?: string;
  description?: string;
  children?: ReactNode;
};

/**
 * Structural section wrapper for homepage assembly.
 * No visual styling — design will be applied in the next phase.
 */
export function FoundationSection({
  id,
  heading,
  description,
  children,
}: FoundationSectionProps) {
  if (!heading && !children) return null;

  return (
    <section id={id} aria-labelledby={heading ? `${id}-heading` : undefined}>
      {heading ? (
        <h2 id={`${id}-heading`} className="sr-only">
          {heading}
        </h2>
      ) : null}
      {description ? <p className="sr-only">{description}</p> : null}
      {children}
    </section>
  );
}

export default FoundationSection;
