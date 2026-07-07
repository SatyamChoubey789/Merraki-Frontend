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

  // --- PDF export (puppeteer-core + @sparticuz/chromium) support ---
  // Prevent Next's bundler from relocating/rewriting this package; it reads
  // its Chromium binary from a path relative to the installed package at
  // runtime, so bundling breaks that lookup. Required per Sparticuz's docs:
  // https://github.com/Sparticuz/chromium#bundler-configuration
  serverExternalPackages: ["@sparticuz/chromium"],
  // Next's output file tracing only follows JS imports, so it won't know
  // the export-pdf route needs this binary directory (it's read from disk,
  // not imported) unless it's explicitly included here.
  outputFileTracingIncludes: {
    "/api/export-pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },

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