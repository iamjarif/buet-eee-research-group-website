import { ContactIdentityBar, ContactLocation } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactPageHeader } from "@/components/contact/ContactPageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/cms";
import { getContactPageDescription } from "@/lib/contact-page";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Contact",
    description: "Contact NC Group at BUET.",
    siteSettings: settings,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="-mt-[var(--layout-header-height)] bg-gradient-to-b from-surface-gradient-start from-0% to-surface-base to-[13.613%]">
      <ContactPageHeader description={getContactPageDescription(settings)} />
      <ContactIdentityBar settings={settings} />

      <section
        aria-label="Contact"
        className="bg-surface-base pb-20 pt-14 lg:pb-24 lg:pt-16"
      >
        <Container as="div">
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-x-20 xl:gap-x-24">
            <ContactForm />

            <Reveal variant="fadeUpSubtle">
              <ContactLocation settings={settings} />
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
