import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.merrakisolutions.com" },
      { protocol: "https", hostname: "cdn.merrakisolutions.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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

  transpilePackages: ["three"],

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

              // Scripts
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://cdn.razorpay.com https://assets.calendly.com https://static.cloudflareinsights.com",

              // Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Fonts
              "font-src 'self' https://fonts.gstatic.com",

              // Images
              "img-src 'self' data: blob: https://api.merrakisolutions.com https://cdn.merrakisolutions.com https://res.cloudinary.com https://images.unsplash.com",

              // Media
              "media-src 'self' blob: https://res.cloudinary.com",

              // API calls / XHR / analytics
              "connect-src 'self' https://api.merrakisolutions.com https://checkout.razorpay.com https://cdn.jsdelivr.net https://unpkg.com https://static.cloudflareinsights.com",

              // iFrames
              "frame-src https://calendly.com https://api.razorpay.com",
            ].join("; "),
          },
        ],
      },

      // Static assets cache
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // API no-cache
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/book-consultation",
        permanent: true,
      },
    ];
  },

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