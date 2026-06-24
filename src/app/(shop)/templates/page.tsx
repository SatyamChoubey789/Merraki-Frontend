import type { Metadata } from 'next';
import { TemplatesPageClient } from '@/components/sections/templates/TemplatesPageClient';

export const metadata: Metadata = {
  title: 'Financial Templates',
  description:
    'Professional Excel dashboards, financial models, and startup templates built by experts.',
};

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}