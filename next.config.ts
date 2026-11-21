import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep old prototype URLs working after the IA revision. (/about is a real page again.)
  async redirects() {
    return [
      { source: "/conferences/:c/sessions", destination: "/conferences/:c#content", permanent: false },
    ];
  },
};

export default nextConfig;
