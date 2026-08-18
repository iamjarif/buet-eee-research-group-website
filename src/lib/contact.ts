export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
};

export type ParsedContactSubmission = {
  payload: ContactFormPayload;
  cvFile: File | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CV_MAX_BYTES = 5 * 1024 * 1024;

const CV_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

const CV_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

export function getCvFileExtension(filename: string): string {
  const match = filename.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] ?? "";
}

export function validateCvFile(file: File): string | null {
  if (file.size <= 0) {
    return "Please choose a CV file to upload.";
  }

  if (file.size > CV_MAX_BYTES) {
    return "CV must be 5 MB or smaller.";
  }

  const extension = getCvFileExtension(file.name);
  if (!CV_EXTENSIONS.has(extension)) {
    return "CV must be a PDF or Word document (.pdf, .doc, .docx).";
  }

  if (file.type && !CV_MIME_TYPES.has(file.type)) {
    return "CV must be a PDF or Word document (.pdf, .doc, .docx).";
  }

  return null;
}

export function sanitizeCvFilename(filename: string): string {
  const basename = filename.split(/[/\\]/).pop()?.trim() ?? "cv";
  const sanitized = basename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "cv.pdf";
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function parseContactSubmission(
  request: Request,
): Promise<ParsedContactSubmission> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const cvEntry = formData.get("cv");
    const cvFile =
      cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

    return {
      payload: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
        company: String(formData.get("company") ?? ""),
      },
      cvFile,
    };
  }

  const body = (await request.json()) as ContactFormPayload;

  return {
    payload: body,
    cvFile: null,
  };
}
