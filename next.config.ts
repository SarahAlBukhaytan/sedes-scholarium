import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep old prototype URLs working after the IA revision.
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/conferences/:c/sessions", destination: "/conferences/:c#content", permanent: false },
    ];
  },
};

export default nextConfig;
