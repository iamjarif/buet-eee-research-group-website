"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function shouldTrackPath(url: string) {
  const path = new URL(url).pathname;
  return !path.startsWith("/studio") && !path.startsWith("/api");
}

export function SiteAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event) => (shouldTrackPath(event.url) ? event : null)}
      />
      <SpeedInsights
        beforeSend={(event) => (shouldTrackPath(event.url) ? event : null)}
      />
    </>
  );
}

export default SiteAnalytics;
