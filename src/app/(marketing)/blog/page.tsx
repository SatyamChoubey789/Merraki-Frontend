import { Metadata } from "next";
import { getBlogPosts, getBlogCategories } from "@/lib/api/blog";
import { BlogPageClient } from "@/components/sections/blog/BlogPageClient";

export const metadata: Metadata = {
  title: "Blog — MerrakiSolutions",
  description: "Insights and guides for founders.",
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    tag?: string;
  }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;

  const [{ posts, pagination }, categories] = await Promise.all([
    getBlogPosts({
      page: params.page ? parseInt(params.page) : 1,
      limit: 12,
      category: params.category,
      search: params.search,
      tag: params.tag,
      sort: "newest",
    }),
    getBlogCategories(),
  ]);

  return (
    <BlogPageClient
      posts={posts}
      pagination={pagination}
      categories={categories}
      activeCategory={params.category}
      searchQuery={params.search}
    />
  );
}
