import type { Metadata } from 'next';
import { FounderTestClient } from '@/components/sections/founderTest/FounderTestClient';

export const metadata: Metadata = {
  title: 'Founder Financial Test',
  description:
    'Discover your financial personality type. Get a personalised report with strengths, risk areas, and growth strategies.',
};

export default function FounderTestPage() {
  return <FounderTestClient />;
}