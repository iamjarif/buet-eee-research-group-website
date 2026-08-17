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
        <section aria-label="Granted patents" className="bg-surface-base page-content-padding">
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
          className="bg-surface-subtle py-14 sm:py-24"
        >
          <Container as="div" className="flex flex-col gap-8 sm:gap-12">
            <Reveal variant="fadeUpSubtle">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h2 className="shrink-0 text-heading-sm text-text-primary">
                  Patent Applications
                </h2>
                <span aria-hidden className="hidden h-px min-w-[1.5rem] flex-1 basis-12 bg-border-default sm:block" />
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
        <section className="bg-surface-base page-content-padding">
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
