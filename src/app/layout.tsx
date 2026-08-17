import type { Metadata, Viewport } from "next";
import { Host_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { colorValues } from "@/config/design-tokens";

import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: colorValues.surfaceBase,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${hostGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
