import { Reveal } from "@/components/motion/Reveal";

type PeopleGroupHeadingProps = {
  id: string;
  title: string;
  count: string;
};

export function PeopleGroupHeading({ id, title, count }: PeopleGroupHeadingProps) {
  return (
    <Reveal variant="fadeUpSubtle">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 id={id} className="min-w-0 text-heading-md text-text-primary sm:text-display-sm">
          {title}
        </h2>
        <span aria-hidden className="hidden h-px min-w-[1.5rem] flex-1 basis-12 bg-border-default sm:block" />
        <p className="type-overline shrink-0 text-text-tertiary">{count}</p>
      </div>
    </Reveal>
  );
}

export default PeopleGroupHeading;
