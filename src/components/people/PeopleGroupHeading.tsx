import { Reveal } from "@/components/motion/Reveal";

type PeopleGroupHeadingProps = {
  id: string;
  title: string;
  count: string;
};

export function PeopleGroupHeading({ id, title, count }: PeopleGroupHeadingProps) {
  return (
    <Reveal variant="fadeUpSubtle">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 id={id} className="text-display-sm text-text-primary">
          {title}
        </h2>
        <span aria-hidden className="hidden h-px flex-1 bg-border-default sm:block" />
        <p className="type-overline shrink-0 text-text-tertiary">{count}</p>
      </div>
    </Reveal>
  );
}

export default PeopleGroupHeading;
