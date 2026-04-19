import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "https://beercomi.onrender.com/uploads/:path*",
      },
    ];
  },
  images: {
    minimumCacheTTL: 2678400, // 31 days in seconds
    deviceSizes: [640, 1080, 1920],   // default has 7 sizes
    imageSizes: [16, 64, 256],        // default has 8 sizes
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3005",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
      },
       {
        protocol: 'https',
        hostname: 'beercomi.onrender.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;