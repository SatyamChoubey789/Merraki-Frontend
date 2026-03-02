export type TemplateCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  display_order: number;
  color_hex: string;
  is_active: boolean;
  templates_count: number;
  created_at: string;
  updated_at: string;
};

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TemplateFormat = 'xlsx' | 'pdf' | 'pptx' | 'csv' | 'bundle';

export interface Template {
  id: number;
  slug: string;
  title: string;
  description: string;
  price_inr: number;
  file_url: string;
  category_id: number;
  tags: string[];
  downloads_count: number;
  views_count: number;
  rating: number;
  rating_count: number;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
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