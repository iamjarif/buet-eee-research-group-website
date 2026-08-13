import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: string;
  className?: string;
  /** Use on dark backgrounds (Join section). */
  inverse?: boolean;
};

export function Eyebrow({ children, className, inverse = false }: EyebrowProps) {
  return (
    <div
      className={cn("flex items-center gap-[var(--spacing-eyebrow-gap)]", className)}
    >
      <span
        aria-hidden
        className="h-px w-[var(--layout-eyebrow-line-width)] shrink-0 bg-brand-primary"
      />
      <p
        className={cn(
          "type-overline",
          inverse ? "text-text-inverse" : "text-text-secondary",
        )}
      >
        {children}
      </p>
    </div>
  );
}

export default Eyebrow;
