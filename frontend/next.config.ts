import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.islamic.network",
      },
      {
        protocol: "https",
        hostname: "quran.com",
      },
    ],
  },
}

export default nextConfig
