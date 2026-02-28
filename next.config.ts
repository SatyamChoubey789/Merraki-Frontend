import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.merrakisolutions.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.merrakisolutions.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts'],
  },
};

export default nextConfig;