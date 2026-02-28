import type { Metadata } from 'next';
import { BlogPageClient } from '@/components/sections/blog/BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog Finance Insights & Guides',
  description: 'Practical finance articles, model breakdowns, and growth strategies for founders.',
};

export default function BlogPage() {
  return <BlogPageClient />;
}