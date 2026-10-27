import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  redirects() {
    return [
      { source: "/alumni-activities", destination: "/alumni-association-events", permanent: false },
      { source: "/association-activities", destination: "/alumni-association-events", permanent: false },
      { source: "/projects-and-benefactors", destination: "/alumni-projects", permanent: false },
    ];
  },
};

export default nextConfig;
