import type { NextConfig } from "next";
require("dotenv").config();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web.amscorp.id", // Domain pertama
        pathname: "/imagestorage/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Domain kedua
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "amscorp.id", // Domain ketiga
        pathname: "/*/*",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Konfig eslint
  },
};

export default nextConfig;
