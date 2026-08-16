import { cn } from "@/lib/utils";

type PageHeaderMetaProps = {
  eyebrow: string;
  stats?: string;
  className?: string;
};

/**
 * Eyebrow + rule + optional stats row used across archive page headers.
 * Wraps naturally on narrow viewports so labels never collide.
 */
export function PageHeaderMeta({ eyebrow, stats, className }: PageHeaderMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <p className="type-overline shrink-0 text-text-secondary">{eyebrow}</p>
      <span
        aria-hidden
        className="h-px min-w-[1.5rem] flex-1 basis-12 bg-border-default"
      />
      {stats ? (
        <p className="type-overline shrink-0 text-text-tertiary">{stats}</p>
      ) : null}
    </div>
  );
}

export default PageHeaderMeta;
