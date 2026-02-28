import type { Metadata } from 'next';
import { BlogPostClient } from '@/components/sections/blog/BlogPostClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ')} | Merraki Blog`,
    description: 'Finance insights and strategies from Merraki Solutions.',
    openGraph: { type: 'article' },
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />;
}