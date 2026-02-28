import type { Metadata } from 'next';
import { BlogPostClient } from '@/components/sections/blog/BlogPostClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${title} | Merraki Blog`,
    description: 'Finance insights and strategies from Merraki Solutions.',
    openGraph: { type: 'article' },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}