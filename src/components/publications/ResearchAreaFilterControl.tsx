"use client";

import {
  getResearchAreaFilters,
  type ResearchAreaFilter,
} from "@/lib/publications";
import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { ResearchAreaEntry } from "../../../sanity/types";

type ResearchAreaFilterControlProps = {
  researchAreas: ResearchAreaEntry[];
  value: ResearchAreaFilter;
  onChange: (value: ResearchAreaFilter) => void;
  className?: string;
};

export function ResearchAreaFilterControl({
  researchAreas,
  value,
  onChange,
  className,
}: ResearchAreaFilterControlProps) {
  const filters = getResearchAreaFilters(researchAreas);
  const isActive = value !== "all";

  if (filters.length <= 1) return null;

  return (
    <div className={cn("relative inline-flex min-w-0 max-w-full", className)}>
      <select
        aria-label="Filter by research area"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "type-overline w-full min-w-0 cursor-pointer appearance-none truncate border",
          "py-2 pl-3 pr-9 text-left sm:py-1.5 sm:pl-3.5",
          "transition-colors duration-300",
          hoverEaseClass,
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
          isActive
            ? "border-text-primary bg-text-primary text-text-inverse"
            : "border-border-strong bg-surface-base text-text-secondary hover:border-text-primary hover:text-text-primary",
        )}
      >
        {filters.map((filter) => (
          <option
            key={filter.value}
            value={filter.value}
            className="bg-surface-base text-text-primary"
          >
            {filter.label}
          </option>
        ))}
      </select>

      <svg
        aria-hidden
        viewBox="0 0 12 12"
        fill="none"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 transition-colors duration-300",
          hoverEaseClass,
          isActive ? "text-text-inverse" : "text-text-tertiary",
        )}
      >
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default ResearchAreaFilterControl;
