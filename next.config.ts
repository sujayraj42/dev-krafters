import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/internship/learn',
        destination: '/learning',
        permanent: false,
      },
      {
        source: '/learn',
        destination: '/learning',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
