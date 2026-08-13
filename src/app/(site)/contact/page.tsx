import { PageShell } from "@/components/layout/PageShell";
import { getSiteSettings } from "@/lib/cms";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Contact",
    description: "Get in touch with S-DREAM at BUET.",
    siteSettings: settings,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <PageShell
      title="Contact"
      description="Contact information and opportunities to join S-DREAM."
    >
      <address className="not-italic space-y-2 text-muted">
        {settings?.contactEmail ? (
          <p>
            Email:{" "}
            <a href={`mailto:${settings.contactEmail}`} className="underline">
              {settings.contactEmail}
            </a>
          </p>
        ) : null}
        {settings?.contactPhone ? <p>Phone: {settings.contactPhone}</p> : null}
        {settings?.contactAddress ? <p>{settings.contactAddress}</p> : null}
      </address>
    </PageShell>
  );
}
