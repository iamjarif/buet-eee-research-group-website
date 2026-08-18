import { getSiteBaseUrl } from "@/lib/cv-access";
import { escapeHtml } from "@/lib/contact";

/** NC Group brand tokens (mirrors src/app/globals.css). */
export const EMAIL_COLORS = {
  brand: "#4684f3",
  textPrimary: "#111113",
  textSecondary: "#55565b",
  textTertiary: "#8a8b90",
  textInverse: "#ffffff",
  surface: "#ffffff",
  surfaceSubtle: "#f8f8f8",
  surfaceInverse: "#101214",
  border: "#e7e7e9",
} as const;

export type EmailField = {
  label: string;
  value: string;
  href?: string;
};

export type EmailLayoutOptions = {
  /** Short preview line shown in inbox list (hidden in body). */
  preheader?: string;
  /** Main heading inside the email body. */
  title: string;
  /** Small pill label, e.g. "Contact" or "Team application". */
  badge?: string;
  siteName?: string;
  siteUrl?: string;
  /** Inner HTML for the main content region (already escaped where needed). */
  bodyHtml: string;
  footerNote?: string;
};

function emailLogoUrl(siteUrl: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/images/nc-group-logo.png`;
}

function renderFieldRows(fields: EmailField[]): string {
  return fields
    .map(({ label, value, href }) => {
      const safeLabel = escapeHtml(label);
      const safeValue = escapeHtml(value);
      const valueCell = href
        ? `<a href="${escapeHtml(href)}" style="color:${EMAIL_COLORS.brand};text-decoration:none;">${safeValue}</a>`
        : safeValue;

      return `
        <tr>
          <td style="padding:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.4;color:${EMAIL_COLORS.textTertiary};text-transform:uppercase;letter-spacing:0.06em;width:96px;vertical-align:top;">
            ${safeLabel}
          </td>
          <td style="padding:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${EMAIL_COLORS.textPrimary};vertical-align:top;">
            ${valueCell}
          </td>
        </tr>`;
    })
    .join("");
}

export function renderEmailMessageBlock(messageHtml: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0 0;border-collapse:collapse;">
      <tr>
        <td style="padding:16px 18px;background-color:${EMAIL_COLORS.surfaceSubtle};border:1px solid ${EMAIL_COLORS.border};border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${EMAIL_COLORS.textPrimary};">
          ${messageHtml}
        </td>
      </tr>
    </table>`;
}

export function renderEmailButton(label: string, href: string): string {
  const safeLabel = escapeHtml(label);
  const safeHref = escapeHtml(href);

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0 0;border-collapse:collapse;">
      <tr>
        <td style="border-radius:6px;background-color:${EMAIL_COLORS.brand};">
          <a href="${safeHref}" style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:${EMAIL_COLORS.textInverse};text-decoration:none;border-radius:6px;">
            ${safeLabel}
          </a>
        </td>
      </tr>
    </table>`;
}

export function renderEmailLayout({
  preheader = "",
  title,
  badge,
  siteName = "NC Group",
  siteUrl = getSiteBaseUrl(),
  bodyHtml,
  footerNote = "You can reply directly to this email to respond to the sender.",
}: EmailLayoutOptions): string {
  const safeTitle = escapeHtml(title);
  const safeSiteName = escapeHtml(siteName);
  const safeSiteUrl = escapeHtml(siteUrl);
  const safePreheader = escapeHtml(preheader);
  const safeFooterNote = escapeHtml(footerNote);
  const logoUrl = escapeHtml(emailLogoUrl(siteUrl));
  const badgeHtml = badge
    ? `<span style="display:inline-block;margin:0 0 12px 0;padding:4px 10px;border-radius:999px;background-color:rgb(70 132 243 / 0.12);font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;line-height:1.4;color:${EMAIL_COLORS.brand};letter-spacing:0.04em;text-transform:uppercase;">${escapeHtml(badge)}</span>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${EMAIL_COLORS.surfaceSubtle};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.surfaceSubtle};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;border-collapse:collapse;background-color:${EMAIL_COLORS.surface};border:1px solid ${EMAIL_COLORS.border};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background-color:${EMAIL_COLORS.surfaceInverse};border-bottom:3px solid ${EMAIL_COLORS.brand};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" width="120" height="34" alt="${safeSiteName}" style="display:block;border:0;outline:none;text-decoration:none;max-width:120px;height:auto;" />
                    </td>
                    <td align="right" style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:${EMAIL_COLORS.textInverse};opacity:0.85;">
                      <a href="${safeSiteUrl}" style="color:${EMAIL_COLORS.textInverse};text-decoration:none;">${safeSiteUrl.replace(/^https?:\/\//, "")}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${badgeHtml}
                <h1 style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;font-weight:600;color:${EMAIL_COLORS.textPrimary};">
                  ${safeTitle}
                </h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 24px 28px;border-top:1px solid ${EMAIL_COLORS.border};background-color:${EMAIL_COLORS.surfaceSubtle};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${EMAIL_COLORS.textSecondary};">
                ${safeFooterNote}<br />
                <span style="color:${EMAIL_COLORS.textTertiary};">${safeSiteName} · BUET</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderEmailFieldsSection(fields: EmailField[]): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 0 0;border-collapse:collapse;">
      ${renderFieldRows(fields)}
    </table>`;
}

export function formatEmailPlainTextSection(title: string, lines: string[]): string {
  return `${title}\n${"─".repeat(title.length)}\n${lines.join("\n")}`;
}
