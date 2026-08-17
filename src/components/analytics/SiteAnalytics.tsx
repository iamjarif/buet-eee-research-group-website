"use client";

import { Analytics } from "@vercel/analytics/next";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const path = new URL(event.url).pathname;
        if (path.startsWith("/studio") || path.startsWith("/api")) {
          return null;
        }
        return event;
      }}
    />
  );
}

export default SiteAnalytics;
