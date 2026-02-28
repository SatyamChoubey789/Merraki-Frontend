export type TemplateCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  templateCount: number;
};

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TemplateFormat = 'xlsx' | 'pdf' | 'pptx' | 'csv' | 'bundle';

export interface Template {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  discountPercent?: number;
  category: TemplateCategory;
  tags: string[];
  format: TemplateFormat;
  difficulty: TemplateDifficulty;
  previewImages: string[];
  thumbnailUrl: string;
  features: string[];
  isFeatured: boolean;
  isPopular: boolean;
  isBestseller: boolean;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'price' | 'popularity' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  difficulty?: TemplateDifficulty;
  format?: TemplateFormat;
}

export interface TemplateSearchParams {
  q: string;
  page?: number;
  limit?: number;
}