export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  readingTime: number;
  isFeatured: boolean;
  isPopular: boolean;
  viewCount: number;
  publishedAt: string;
  updatedAt: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  sortBy?: 'newest' | 'popular' | 'views';
}

export interface BlogSearchParams {
  q: string;
  page?: number;
  limit?: number;
}