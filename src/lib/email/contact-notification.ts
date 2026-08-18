import { escapeHtml } from "@/lib/contact";
import {
  formatEmailPlainTextSection,
  renderEmailButton,
  renderEmailFieldsSection,
  renderEmailLayout,
  renderEmailMessageBlock,
  type EmailField,
} from "@/lib/email/template";

export type ContactNotificationInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  cvDownloadUrl?: string;
  cvFilename?: string;
};

export type ContactNotificationEmail = {
  subject: string;
  text: string;
  html: string;
};

function buildFields(input: ContactNotificationInput): EmailField[] {
  return [
    { label: "From", value: `${input.name} <${input.email}>`, href: `mailto:${input.email}` },
    { label: "Email", value: input.email, href: `mailto:${input.email}` },
    { label: "Subject", value: input.subject },
  ];
}

export function buildContactNotificationEmail(
  input: ContactNotificationInput,
): ContactNotificationEmail {
  const isApplication = Boolean(input.cvDownloadUrl);
  const badge = isApplication ? "Team application" : "Contact";
  const title = isApplication ? "New team application" : "New contact message";
  const emailSubject = isApplication
    ? `[NC Group Application] ${input.subject}`
    : `[NC Group Contact] ${input.subject}`;

  const messageHtml = escapeHtml(input.message).replaceAll("\n", "<br />");
  const cvFilename = input.cvFilename?.trim() || "Download resume";

  let bodyHtml = renderEmailFieldsSection(buildFields(input));
  bodyHtml += `
    <p style="margin:20px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:#8a8b90;text-transform:uppercase;letter-spacing:0.06em;">
      Message
    </p>`;
  bodyHtml += renderEmailMessageBlock(messageHtml);

  if (input.cvDownloadUrl) {
    bodyHtml += renderEmailButton(`Download ${cvFilename}`, input.cvDownloadUrl);
  }

  const textSections = [
    formatEmailPlainTextSection("Details", [
      `From: ${input.name} <${input.email}>`,
      `Subject: ${input.subject}`,
    ]),
    formatEmailPlainTextSection("Message", [input.message]),
  ];

  if (input.cvDownloadUrl) {
    textSections.push(
      formatEmailPlainTextSection("CV", [
        `${cvFilename}: ${input.cvDownloadUrl}`,
      ]),
    );
  }

  return {
    subject: emailSubject,
    text: textSections.join("\n\n"),
    html: renderEmailLayout({
      preheader: `${input.name} — ${input.subject}`,
      title,
      badge,
      bodyHtml,
      footerNote: isApplication
        ? "A CV was attached. Use the download link above or review the application in Sanity. Reply directly to respond to the applicant."
        : "You can reply directly to this email to respond to the sender.",
    }),
  };
}
