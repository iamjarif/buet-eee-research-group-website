import Link from "next/link";

import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { JoinSection } from "@/components/home/JoinSection";
import { PublicationTrack } from "@/components/home/PublicationTrack";
import { ResearchSection } from "@/components/home/ResearchSection";
import { TeamSection } from "@/components/home/TeamSection";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { getActivities, getHomepage, getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";
import { isSanityConfigured } from "../../../sanity/env";

export async function generateMetadata() {
  const [settings, homepage] = await Promise.all([getSiteSettings(), getHomepage()]);

  return buildMetadata({
    title: homepage?.heroHeading,
    description: homepage?.heroDescription,
    seo: homepage?.seo,
    siteSettings: settings,
    path: "/",
  });
}

export default async function HomePage() {
  const homepage = await getHomepage();

  if (!isSanityConfigured) {
    return (
      <Container as="section" className="py-16">
        <Reveal immediate variant="fadeUpSubtle">
          <h1 className="text-heading-lg">NC Group Website Foundation</h1>
        </Reveal>
        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <p className="mt-4 max-w-2xl text-body-md text-text-muted">
            The application architecture is ready. Configure Sanity environment variables
            in{" "}
            <code className="rounded bg-border-default px-1 py-0.5 text-body-sm">
              .env.local
            </code>{" "}
            and add content in Sanity Studio at{" "}
            <Link href="/studio" className="underline">
              /studio
            </Link>
            .
          </p>
        </Reveal>
      </Container>
    );
  }

  if (!homepage) {
    return (
      <Container as="section" className="py-16">
        <Reveal immediate variant="fadeUpSubtle">
          <h1 className="text-heading-lg">NC Group Website Foundation</h1>
        </Reveal>
        <Reveal immediate variant="fadeUpSubtle" delay={0.08}>
          <p className="mt-4 max-w-2xl text-body-md text-text-muted">
            Sanity is connected, but the Homepage document has not been created yet. Open{" "}
            <Link href="/studio" className="underline">
              Sanity Studio
            </Link>{" "}
            and create the <strong>Homepage</strong> singleton from the sidebar. Do the
            same for <strong>Site Settings</strong> to enable navigation and footer
            content.
          </p>
        </Reveal>
      </Container>
    );
  }

  const activities =
    homepage.featuredActivities?.length && homepage.featuredActivities.length > 0
      ? homepage.featuredActivities
      : (await getActivities()).slice(0, 4);

  return (
    <>
      <HeroSection
        eyebrow={homepage.heroEyebrow}
        heading={homepage.heroHeading}
        description={homepage.heroDescription}
        buttons={homepage.heroButtons}
      />

      <PublicationTrack publications={homepage.featuredPublications} />

      <ResearchSection
        heading={homepage.researchSectionHeading}
        description={homepage.researchSectionDescription}
        areas={homepage.featuredResearchAreas}
      />

      <TeamSection
        heading={homepage.teamSectionHeading}
        description={homepage.teamSectionDescription}
        image={homepage.teamImage}
        link={homepage.teamSectionLink}
      />

      <ActivitiesSection
        heading={homepage.activitiesSectionHeading}
        activities={activities}
      />

      <JoinSection
        heading={homepage.joinUsHeading}
        description={homepage.joinUsDescription}
        button={homepage.joinUsButton}
      />
    </>
  );
}
