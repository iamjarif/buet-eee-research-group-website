"use client";

import dynamic from "next/dynamic";

import config from "../../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((module) => module.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#101112] text-sm text-white/60">
        Loading Studio…
      </div>
    ),
  },
);

export default function StudioClient() {
  return <NextStudio config={config} />;
}
