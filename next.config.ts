import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // ─── Image optimisation ───────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.merrakisolutions.com",
      },
      {
        protocol: "https",
        hostname: "cdn.merrakisolutions.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Development — local backend
      ...(isDev
        ? [
          {
            protocol: "http" as const,
            hostname: "localhost",
          },
        ]
        : []),
    ],

    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,

    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ─── Package optimisation ─────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "framer-motion",
      "date-fns",
    ],
  },

  transpilePackages: ["three"],

  serverExternalPackages: ["@sparticuz/chromium"],

  outputFileTracingIncludes: {
    "/api/export-pdf": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
    ],
  },

  // ─── Security headers ─────────────────────────────────────────────────────
  async headers() {
    const apiOrigin = isDev
      ? "http://localhost:8000"
      : "https://api.merrakisolutions.com";

    const contentSecurityPolicy = [
      // Default
      "default-src 'self'",

      // JavaScript
      [
        "script-src",
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",

        // Razorpay
        "https://checkout.razorpay.com",
        "https://cdn.razorpay.com",

        // Calendly
        "https://assets.calendly.com",

        // Cloudflare Insights
        "https://static.cloudflareinsights.com",

        // Vercel Analytics + Speed Insights
        "https://va.vercel-scripts.com",
      ].join(" "),

      // Styles
      [
        "style-src",
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ].join(" "),

      // Fonts
      [
        "font-src",
        "'self'",
        "data:",
        "https://fonts.gstatic.com",
      ].join(" "),

      // Images
      [
        "img-src",
        "'self'",
        "data:",
        "blob:",
        apiOrigin,
        "https://api.merrakisolutions.com",
        "https://cdn.merrakisolutions.com",
        "https://res.cloudinary.com",
        "https://images.unsplash.com",
      ].join(" "),

      // Video / audio
      [
        "media-src",
        "'self'",
        "blob:",
        "https://res.cloudinary.com",
      ].join(" "),

      // API / fetch / WebSocket / analytics connections
      [
        "connect-src",
        "'self'",
        apiOrigin,
        "https://api.merrakisolutions.com",

        // Razorpay
        "https://checkout.razorpay.com",
        "https://cdn.razorpay.com",

        // Calendly / external resources
        "https://assets.calendly.com",

        // Cloudflare Insights
        "https://static.cloudflareinsights.com",

        // Vercel Analytics + Speed Insights
        "https://va.vercel-scripts.com",

        // Existing external resources
        "https://cdn.jsdelivr.net",
        "https://unpkg.com",
      ].join(" "),

      // Iframes
      [
        "frame-src",
        "https://calendly.com",
        "https://api.razorpay.com",
      ].join(" "),
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },

      // ─── Static asset caching ──────────────────────────────────────────────
      {
        source:
          "/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, immutable",
          },
        ],
      },

      // ─── API responses should never be cached ──────────────────────────────
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

  // ─── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: "/contact",
        destination: "/book-consultation",
        permanent: true,
      },
    ];
  },

  // ─── Bundle analyser ──────────────────────────────────────────────────────
  ...(process.env.ANALYZE === "true" && {
    webpack(config: any) {
      const { BundleAnalyzerPlugin } =
        require("@next/bundle-analyzer")({
          enabled: true,
        });

      config.plugins.push(new BundleAnalyzerPlugin());

      return config;
    },
  }),
};

export default nextConfig;