import { hoverEaseClass } from "@/lib/motion/transitions";
import { cn } from "@/lib/utils";
import type { Link } from "../../../sanity/types";

type PersonLinksProps = {
  links: Link[];
  /** Used to disambiguate repeated link labels for screen readers. */
  personName: string;
  className?: string;
};

const linkClassName = cn(
  "text-caption text-text-tertiary transition-colors duration-300",
  hoverEaseClass,
  "hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
);

export function PersonLinks({ links, personName, className }: PersonLinksProps) {
  if (links.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}>
      {links.map((link) => (
        <li key={`${link.label}-${link.href}`}>
          <a
            href={link.href}
            aria-label={`${link.label} — ${personName}`}
            className={linkClassName}
            {...(link.openInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default PersonLinks;
