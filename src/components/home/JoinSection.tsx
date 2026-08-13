import type { PortableTextBlock } from "@portabletext/types";

import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { Link } from "../../../sanity/types";

type JoinSectionProps = {
  eyebrow?: string;
  heading?: string;
  description?: PortableTextBlock[];
  button?: Link;
};

export function JoinSection({
  eyebrow = "05 / JOIN OUR TEAM",
  heading,
  description,
  button,
}: JoinSectionProps) {
  if (!heading && !description?.length && !button) return null;

  const plainDescription =
    description?.length === 1 &&
    description[0]?._type === "block" &&
    "children" in description[0]
      ? description[0].children?.map((child) => child.text ?? "").join("")
      : null;

  return (
    <section
      aria-labelledby="join-heading"
      className="bg-surface-inverse py-24 lg:py-32"
    >
      <Container as="div">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <Stagger stagger={0.12} className="max-w-[700px] space-y-5">
            <StaggerItem>
              <Eyebrow inverse>{eyebrow}</Eyebrow>
            </StaggerItem>
            {heading ? (
              <StaggerItem>
                <h2
                  id="join-heading"
                  className="text-section-title text-text-inverse-secondary"
                >
                  {heading.split("\n").map((line, index) => (
                    <span key={`${line}-${index}`} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </StaggerItem>
            ) : null}
            {plainDescription ? (
              <StaggerItem>
                <p className="max-w-[560px] text-body-lg text-text-inverse-muted">
                  {plainDescription}
                </p>
              </StaggerItem>
            ) : description?.length ? (
              <StaggerItem>
                <div className="max-w-[560px] [&_p]:text-body-lg [&_p]:text-text-inverse-muted">
                  <PortableTextContent value={description} />
                </div>
              </StaggerItem>
            ) : null}
          </Stagger>

          {button?.href ? (
            <Stagger delayChildren={0.2}>
              <StaggerItem>
                <LinkButton
                  href={button.href}
                  external={button.openInNewTab}
                  className="shrink-0"
                >
                  {button.label}
                  {!button.label.includes("→") ? " →" : ""}
                </LinkButton>
              </StaggerItem>
            </Stagger>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export default JoinSection;
