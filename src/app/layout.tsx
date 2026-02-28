'use client';

import type { Metadata } from 'next';
import { DM_Sans, IBM_Plex_Sans } from 'next/font/google';
import { Providers } from './providers';
import { PageWrapper } from '@/components/layout/PageWrapper/PageWrapper';
import { CartDrawer } from '@/components/layout/CartDrawer/CartDrawer';
import { ToastContainer } from '@/components/layout/ToastContainer/ToastContainer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Merraki Solutions — Your Trusted Partner in Fiscal Fitness',
    template: '%s | Merraki Solutions',
  },
  description:
    'We simplify finance so businesses amplify growth. Financial modelling, Excel dashboards, templates, and founder consulting.',
  keywords: [
    'financial modelling',
    'excel templates',
    'startup finance',
    'financial consulting',
    'bookkeeping',
    'merraki solutions',
  ],
  authors: [{ name: 'Merraki Solutions' }],
  creator: 'Merraki Solutions',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://merrakisolutions.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Merraki Solutions',
    title: 'Merraki Solutions — Your Trusted Partner in Fiscal Fitness',
    description: 'We simplify finance so businesses amplify growth.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Merraki Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merraki Solutions',
    description: 'We simplify finance so businesses amplify growth.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {/* PageWrapper wraps the main page content */}
          <PageWrapper>{children}</PageWrapper>

          {/* Global components always available */}
          <CartDrawer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}