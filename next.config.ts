import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ 
  // other next config here...
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
