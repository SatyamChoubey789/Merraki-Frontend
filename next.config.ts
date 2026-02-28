import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.merrakisolutions.com" },
      { protocol: "https", hostname: "cdn.merrakisolutions.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "recharts",
      "framer-motion",
      "date-fns",
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://cdn.razorpay.com https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://api.merrakisolutions.com https://cdn.merrakisolutions.com https://res.cloudinary.com",
              "connect-src 'self' https://api.merrakisolutions.com https://checkout.razorpay.com",
              "frame-src https://calendly.com https://api.razorpay.com",
            ].join("; "),
          },
        ],
      },
      // Cache static assets aggressively
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirect old paths if needed
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/book-consultation",
        permanent: true,
      },
    ];
  },

  // Bundle analyser (run: ANALYZE=true npm run build)
  ...(process.env.ANALYZE === "true" && {
    webpack(config: any) {
      const { BundleAnalyzerPlugin } = require("@next/bundle-analyzer")({
        enabled: true,
      });
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
};

export default nextConfig;
