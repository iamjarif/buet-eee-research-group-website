import { type NextRequest, NextResponse } from "next/server";

import { getSiteSettings } from "@/lib/cms";
import { escapeHtml, validateContactForm, type ContactFormPayload } from "@/lib/contact";

export async function POST(request: NextRequest) {
  let body: ContactFormPayload;

  try {
    body = (await request.json()) as ContactFormPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validationError = validateContactForm(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL;
  const settings = await getSiteSettings();
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL ?? settings?.contactEmail;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Contact form is not configured. Set RESEND_API_KEY, CONTACT_FORM_FROM_EMAIL, and CONTACT_FORM_TO_EMAIL or contactEmail in Sanity.");
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please email us directly." },
      { status: 503 },
    );
  }

  const name = body.name.trim();
  const email = body.email.trim();
  const subject = body.subject.trim();
  const message = body.message.trim();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[NC Group Contact] ${subject}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        html: `
          <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `.trim(),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", response.status, errorBody);
      return NextResponse.json(
        { error: "Unable to send your message. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again later." },
      { status: 500 },
    );
  }
}
