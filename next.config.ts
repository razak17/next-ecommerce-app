import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.sh",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
