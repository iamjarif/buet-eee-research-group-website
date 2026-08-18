import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";

export const metadata: Metadata = {
  ...studioMetadata,
  icons: {
    icon: [],
    apple: [],
    shortcut: [],
  },
};

export const viewport: Viewport = studioViewport;

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="fixed inset-0 z-50 h-screen overflow-hidden">{children}</div>;
}
