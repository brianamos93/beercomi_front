import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://placehold.jp/****'), new URL('http://localhost:3005/uploads/****')],
  }
};

export default nextConfig;
