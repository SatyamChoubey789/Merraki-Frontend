import type { Metadata } from 'next';
import { AboutPageClient } from '@/components/sections/about/AboutPageClient';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet Parag Bhutani and Khyati Gupta — the finance experts behind Merraki Solutions.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}