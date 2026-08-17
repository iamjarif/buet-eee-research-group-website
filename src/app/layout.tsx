import type { Metadata, Viewport } from "next";
import { Geist, Tinos } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import type { ReactNode } from "react";

import { colorValues } from "@/config/design-tokens";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
      className={`${geistSans.variable} ${tinos.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Analytics
          beforeSend={(event) => {
            const path = new URL(event.url).pathname;
            if (path.startsWith("/studio") || path.startsWith("/api")) {
              return null;
            }
            return event;
          }}
        />
      </body>
    </html>
  );
}
