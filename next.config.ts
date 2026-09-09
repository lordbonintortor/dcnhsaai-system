import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      { source: "/alumni-activities", destination: "/alumni-association-events", permanent: false },
      { source: "/association-activities", destination: "/alumni-association-events", permanent: false },
      { source: "/projects-and-benefactors", destination: "/alumni-projects", permanent: false },
    ];
  },
};

export default nextConfig;
