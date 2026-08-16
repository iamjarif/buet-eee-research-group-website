import { PatentApplicationCard } from "@/components/patents/PatentApplicationCard";
import { PatentListEntry } from "@/components/patents/PatentListEntry";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Container } from "@/components/ui/Container";
import { formatPatentListingNumber, partitionPatents } from "@/lib/patents";
import type { PatentSummary } from "../../../sanity/types";

type PatentsCatalogProps = {
  patents: PatentSummary[];
};

export function PatentsCatalog({ patents }: PatentsCatalogProps) {
  const { granted, pending } = partitionPatents(patents);

  return (
    <>
      {granted.length > 0 ? (
        <section aria-label="Granted patents" className="bg-surface-base pb-[120px] pt-8">
          <Container as="div">
            <Stagger stagger={0.06}>
              {granted.map((patent, index) => (
                <StaggerItem key={patent._id}>
                  <PatentListEntry
                    patent={patent}
                    listingNumber={formatPatentListingNumber(index)}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ) : null}

      {pending.length > 0 ? (
        <section
          aria-label="Patent applications"
          className="bg-surface-subtle py-24"
        >
          <Container as="div" className="flex flex-col gap-12">
            <Reveal variant="fadeUpSubtle">
              <div className="flex items-center gap-4">
                <h2 className="shrink-0 font-serif text-display-sm text-text-primary">
                  Patent Applications
                </h2>
                <span aria-hidden className="h-px flex-1 bg-border-default" />
                <p className="type-overline shrink-0 text-text-tertiary">Pending</p>
              </div>
            </Reveal>

            <Stagger
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              stagger={0.08}
            >
              {pending.map((patent) => (
                <StaggerItem key={patent._id}>
                  <PatentApplicationCard patent={patent} />
                </StaggerItem>
              ))}
            </Stagger>
          </Container>
        </section>
      ) : null}

      {granted.length === 0 && pending.length === 0 ? (
        <section className="bg-surface-base pb-[120px] pt-14">
          <Container as="div">
            <Reveal variant="fadeUpSubtle">
              <p className="text-body-sm text-text-secondary">
                No patents have been published yet.
              </p>
            </Reveal>
          </Container>
        </section>
      ) : null}
    </>
  );
}

export default PatentsCatalog;
