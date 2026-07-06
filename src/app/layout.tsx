import type { Metadata } from "next";
import {
  DM_Sans,
  IBM_Plex_Sans,
  Caveat,
  Cormorant_Garamond,
} from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "./providers";
import { PageWrapper } from "@/components/layout/PageWrapper/PageWrapper";
import { generateOrganizationSchema } from "@/lib/utils/metadata";
import { StructuredData } from "@/components/ui/StructuredData/StructuredData";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: {
    default: "Merraki Solutions Your Trusted Partner in Fiscal Fitness",
    template: "%s | Merraki Solutions",
  },
  description:
    "We simplify finance so businesses amplify growth. Financial modelling, Excel dashboards, templates, and founder consulting.",
  keywords: [
    "financial modelling",
    "excel templates",
    "startup finance",
    "financial consulting",
    "bookkeeping",
    "merraki solutions",
  ],
  authors: [{ name: "Merraki Solutions" }],
  creator: "Merraki Solutions",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://merrakisolutions.com",
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Merraki Solutions",
    title: "Merraki Solutions Your Trusted Partner in Fiscal Fitness",
    description: "We simplify finance so businesses amplify growth.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Merraki Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merraki Solutions",
    description: "We simplify finance so businesses amplify growth.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect PDF preview routes — hide all global chrome for Puppeteer captures
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isPdf = pathname.startsWith("/pdf-preview");

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexSans.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body>
        <Providers>
          <PageWrapper noHeader={isPdf} noFooter={isPdf}>
            {children}
          </PageWrapper>

          {/* Only render global widgets on non-PDF pages */}
          {!isPdf && <WhatsAppWidget />}
        </Providers>
      </body>
    </html>
  );
}