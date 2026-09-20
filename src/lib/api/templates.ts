import { apiFetch } from "./client";
import type {
    TemplateListResponse,
    TemplateSingleResponse,
    CategoryListResponse,
    TemplateListParams,
    TemplateListItem,
    TemplateFull,
    TemplateCategory,
    Pagination,
} from "@/types/templatesTypes";

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getTemplateCategories(): Promise<TemplateCategory[]> {
    try {
        const res = await apiFetch<CategoryListResponse>("/template-categories", {
            revalidate: 300,
            tags: ["template-categories"],
        });
        return res.data;
    } catch {
        return [];
    }
}

// ─── Public list ──────────────────────────────────────────────────────────────

export async function getTemplates(params?: TemplateListParams): Promise<{
    templates: TemplateListItem[];
    pagination: Pagination;
}> {
    const res = await apiFetch<TemplateListResponse>("/templates", {
        revalidate: 60,
        tags: ["templates"],
        params: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 12,
            search: params?.search,
            category: params?.category,
            tag: params?.tag,
            featured: params?.featured,
            minPrice: params?.minPrice,
            maxPrice: params?.maxPrice,
            sort: params?.sort ?? "newest",
        },
    });

    return {
        templates: res.data,
        pagination: res.pagination,
    };
}

// ─── Public single (by slug) ──────────────────────────────────────────────────

export async function getTemplateBySlug(
    slug: string,
): Promise<TemplateFull | null> {
    try {
        const res = await apiFetch<TemplateSingleResponse>(`/templates/${slug}`, {
            revalidate: 60,
            tags: [`template-${slug}`],
        });
        return res.data;
    } catch {
        return null;
    }
}

// ─── Client-side fetchers (for hooks / SWR) ───────────────────────────────────
// These hit the API directly without Next.js ISR caching —
// used inside useTemplate / useTemplates hooks on the client.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function clientFetch<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") {
                url.searchParams.set(k, String(v));
            }
        });
    }
    const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? `API error ${res.status}`);
    }
    return res.json();
}

export async function fetchTemplates(
    params?: TemplateListParams,
): Promise<TemplateListResponse> {
    return clientFetch<TemplateListResponse>("/templates", params);
}

export async function fetchTemplateBySlug(
    slug: string,
): Promise<TemplateSingleResponse> {
    return clientFetch<TemplateSingleResponse>(`/templates/${slug}`);
}

export async function fetchCategories(): Promise<CategoryListResponse> {
    return clientFetch<CategoryListResponse>("/template-categories");
}