import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity 6.9.x StructureToolProvider hits a React 19 dev-mode bug when the
  // custom structure resolver appears after the first tool render (Strict Mode
  // double-render makes the console warnings repeat).
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  transpilePackages: ["next-sanity", "sanity"],
};

export default nextConfig;
