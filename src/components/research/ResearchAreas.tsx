import { ResearchAreaSection } from "@/components/research/ResearchAreaSection";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import type { ResearchAreaEntry } from "../../../sanity/types";

type ResearchAreasProps = {
  areas: ResearchAreaEntry[];
};

export function ResearchAreas({ areas }: ResearchAreasProps) {
  return (
    <div className="bg-surface-base pb-[120px]">
      <Container as="div">
        {areas.length > 0 ? (
          areas.map((area, index) => (
            <Reveal key={area._id} variant="fadeUpSubtle" viewport={{ once: true, amount: 0 }}>
              <ResearchAreaSection
                area={area}
                index={index + 1}
                priority={index === 0}
              />
            </Reveal>
          ))
        ) : (
          <Reveal variant="fadeUpSubtle">
            <p className="text-body-sm text-text-secondary">
              Research areas will appear here.
            </p>
          </Reveal>
        )}
      </Container>
    </div>
  );
}

export default ResearchAreas;
