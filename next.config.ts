import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/programs',
        destination: '/winter-internship',
        permanent: false,
      },
      {
        source: '/program',
        destination: '/winter-internship',
        permanent: false,
      },
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
