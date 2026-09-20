import { apiFetch, ApiList, ApiSuccess } from "./client"
import { tiptapToHtml, estimateReadingTime } from "../tiptap-to-html"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BlogCategory {
    id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
}

export interface BlogAuthor {
    id: string
    name: string
    bio: string | null
    avatarUrl: string | null
}

export interface BlogPostSummary {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImageUrl: string | null
    authorId: string | null
    categoryId: string | null
    tags: string[]
    status: "published" | "draft" | "archived"
    publishedAt: string | null
    createdAt: string
    updatedAt: string
}

export interface BlogPostFull extends BlogPostSummary {
    content: any
    seoTitle: string | null
    seoDescription: string | null
    author: BlogAuthor | null
    category: BlogCategory | null
}

// ── Component-ready shapes ────────────────────────────────────────────────────

export interface BlogPostForCard {
    id: string
    slug: string
    title: string
    excerpt: string | null
    coverImage: string | null
    category: { id: string; name: string; slug: string } | null
    tags: string[]
    readingTime: number
    publishedAt: string | null
    createdAt: string
}

export interface BlogPostForPage extends BlogPostForCard {
    content: string
    seoTitle: string | null
    seoDescription: string | null
    author: BlogAuthor | null
}

export interface BlogListParams {
    page?: number
    limit?: number
    search?: string
    category?: string   // category slug
    tag?: string
    sort?: "newest" | "oldest"
}

// ── Adapters ──────────────────────────────────────────────────────────────────

export function adaptPostToCard(
    post: BlogPostSummary,
    categories: BlogCategory[]
): BlogPostForCard {
    const category = categories.find((c) => c.id === post.categoryId) ?? null
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImageUrl,
        category: category
            ? { id: category.id, name: category.name, slug: category.slug }
            : null,
        tags: post.tags ?? [],
        readingTime: 3,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
    }
}

export function adaptPostToPage(post: BlogPostFull): BlogPostForPage {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        coverImage: post.coverImageUrl,
        category: post.category
            ? { id: post.category.id, name: post.category.name, slug: post.category.slug }
            : null,
        tags: post.tags ?? [],
        readingTime: estimateReadingTime(post.content),
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        content: tiptapToHtml(post.content),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        author: post.author,
    }
}

// ── Server fetchers (RSC + ISR) ───────────────────────────────────────────────

export async function getBlogPosts(params?: BlogListParams): Promise<{
    posts: BlogPostForCard[]
    pagination: ApiList<BlogPostSummary>["pagination"]
}> {
    const [postsRes, categoriesRes] = await Promise.all([
        apiFetch<ApiList<BlogPostSummary>>("/blog/posts", {
            revalidate: 60,
            tags: ["blog-posts"],
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 12,
                search: params?.search,
                category: params?.category,
                tag: params?.tag,
                sort: params?.sort ?? "newest",
            },
        }),
        apiFetch<ApiSuccess<BlogCategory[]>>("/blog/categories", {
            revalidate: 300,
            tags: ["blog-categories"],
        }),
    ])

    const categories = categoriesRes.data ?? []

    return {
        posts: postsRes.data.map((p) => adaptPostToCard(p, categories)),
        pagination: postsRes.pagination,
    }
}

export async function getBlogPostBySlug(
    slug: string
): Promise<BlogPostForPage | null> {
    try {
        const res = await apiFetch<ApiSuccess<BlogPostFull>>(
            `/blog/posts/${slug}`,
            {
                revalidate: 60,
                tags: [`blog-post-${slug}`],
            }
        )
        return adaptPostToPage(res.data)
    } catch {
        return null
    }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
    try {
        const res = await apiFetch<ApiSuccess<BlogCategory[]>>("/blog/categories", {
            revalidate: 300,
            tags: ["blog-categories"],
        })
        return res.data
    } catch {
        return []
    }
}