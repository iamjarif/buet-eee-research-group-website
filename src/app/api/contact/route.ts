import { type NextRequest, NextResponse } from "next/server";

import { createApplicationDocument, uploadApplicationCv } from "@/lib/applications";
import { buildCvDownloadUrl } from "@/lib/cv-access";
import { getSiteSettings } from "@/lib/cms";
import { buildContactNotificationEmail } from "@/lib/email/contact-notification";
import {
  parseContactSubmission,
  validateContactForm,
  validateCvFile,
} from "@/lib/contact";

async function sendContactEmail(
  content: Parameters<typeof buildContactNotificationEmail>[0],
  config: { apiKey: string; fromEmail: string; toEmail: string },
): Promise<boolean> {
  const { subject, text, html } = buildContactNotificationEmail(content);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: [config.toEmail],
      reply_to: content.email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.warn("Resend API error (email skipped):", response.status, errorBody);
    return false;
  }

  return true;
}

function isEmailConfigured(toEmail?: string | null): boolean {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL?.trim();

  if (!apiKey || apiKey.includes("your_resend")) {
    return false;
  }

  return Boolean(fromEmail && toEmail?.trim());
}

export async function POST(request: NextRequest) {
  let submission: Awaited<ReturnType<typeof parseContactSubmission>>;

  try {
    submission = await parseContactSubmission(request);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { payload, cvFile } = submission;

  const validationError = validateContactForm(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (cvFile) {
    const cvValidationError = validateCvFile(cvFile);
    if (cvValidationError) {
      return NextResponse.json({ error: cvValidationError }, { status: 400 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL?.trim();
  const settings = await getSiteSettings();
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL?.trim() ?? settings?.contactEmail?.trim();
  const emailConfigured = isEmailConfigured(toEmail);

  if (!emailConfigured) {
    console.warn(
      "Contact form email skipped: set RESEND_API_KEY, CONTACT_FORM_FROM_EMAIL, and CONTACT_FORM_TO_EMAIL or contactEmail in Sanity.",
    );
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();
  const submittedAt = new Date();

  let cvDownloadUrl: string | undefined;
  let cvFilename: string | undefined;

  try {
    if (cvFile) {
      const uploaded = await uploadApplicationCv(cvFile, submittedAt);
      cvFilename = uploaded.cvFilename;

      const application = await createApplicationDocument({
        name,
        email,
        message,
        cvPathname: uploaded.cvPathname,
        cvFilename: uploaded.cvFilename,
        submittedAt: submittedAt.toISOString(),
      });

      cvDownloadUrl = buildCvDownloadUrl(application._id);
    }

    if (emailConfigured && apiKey && fromEmail && toEmail) {
      const sent = await sendContactEmail(
        { name, email, subject, message, cvDownloadUrl, cvFilename },
        { apiKey, fromEmail, toEmail },
      );

      if (!sent) {
        console.warn("Contact form email was not sent; submission stored successfully.");
      }
    }

    return NextResponse.json({ success: true, emailSent: emailConfigured });
  } catch (error) {
    console.error("Contact form error:", error);

    const messageText =
      error instanceof Error && error.message.includes("Missing BLOB_READ_WRITE_TOKEN")
        ? "CV uploads are not configured yet. Please email your resume directly."
        : error instanceof Error && error.message.includes("Missing SANITY_API_WRITE_TOKEN")
          ? "Applications are not configured yet. Please email your resume directly."
          : "Unable to send your message. Please try again later.";

    return NextResponse.json({ error: messageText }, { status: 500 });
  }
}
