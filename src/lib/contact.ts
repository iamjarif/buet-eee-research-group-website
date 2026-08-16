export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(payload: ContactFormPayload): string | null {
  if (payload.company?.trim()) {
    return "Invalid submission.";
  }

  const name = payload.name.trim();
  if (name.length < 2 || name.length > 100) {
    return "Please enter your name (2–100 characters).";
  }

  const email = payload.email.trim();
  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }

  const subject = payload.subject.trim();
  if (subject.length < 3 || subject.length > 200) {
    return "Please enter a subject (3–200 characters).";
  }

  const message = payload.message.trim();
  if (message.length < 10 || message.length > 5000) {
    return "Please enter a message (10–5,000 characters).";
  }

  return null;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
