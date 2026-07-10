import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: false },
      { source: "/experience", destination: "/#experience", permanent: false },
      { source: "/project", destination: "/#work", permanent: false },
      { source: "/suggestion", destination: "/#contact", permanent: false },
    ];
  },
};

export default nextConfig;
