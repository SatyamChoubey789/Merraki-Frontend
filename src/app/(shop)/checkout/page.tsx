import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/components/sections/checkout/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase securely.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}