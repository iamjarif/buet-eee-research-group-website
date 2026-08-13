import type { ReactNode } from "react";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <div className="fixed inset-0 z-50 h-screen overflow-hidden">{children}</div>;
}
