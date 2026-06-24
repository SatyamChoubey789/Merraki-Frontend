import type { Metadata } from 'next';
import { FounderTestClient } from '@/components/sections/founderTest/FounderTestClient';

export const metadata: Metadata = {
  title: 'Financial Personality Test — Merraki Solutions',
  description: 'Discover your founder financial personality type. Free 5-minute assessment.',
  robots: { index: true, follow: true },
};

export default function FounderTestPage() {
  return <FounderTestClient />;
}