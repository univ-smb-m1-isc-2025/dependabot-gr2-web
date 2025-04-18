import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;