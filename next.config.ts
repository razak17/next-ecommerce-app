import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.sh",
      },
      {
        protocol: "https",
        hostname: "ufs.sh",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
