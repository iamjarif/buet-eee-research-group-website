import { HeroHoneycomb } from "@/components/home/HeroHoneycomb";
import type { HeroHoneycombNode } from "@/lib/hero-honeycomb";
import type { Link } from "../../../sanity/types";

type HeroSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  buttons?: Link[];
  honeycombNodes?: HeroHoneycombNode[];
};

export function HeroSection({ heading, honeycombNodes }: HeroSectionProps) {
  if (!heading) return null;

  return (
    <section
      aria-labelledby="hero-heading"
      data-hero-section
      className="relative -mt-[var(--layout-header-height)] overflow-hidden bg-surface-base select-none"
    >
      <h1 id="hero-heading" className="sr-only">
        {heading}
      </h1>

      <div className="relative min-h-[min(640px,85vh)] sm:min-h-[min(760px,88vh)] lg:min-h-[min(860px,90vh)]">
        <HeroHoneycomb nodes={honeycombNodes} />
      </div>
    </section>
  );
}

export default HeroSection;
