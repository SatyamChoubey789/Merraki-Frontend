"use client";

import useSWR from "swr";
import { fetchTemplates, fetchTemplateBySlug, fetchCategories } from "@/lib/api/templates";
import type {
    TemplateListParams,
    TemplateListItem,
    TemplateFull,
    TemplateCategory,
    Pagination,
} from "@/types/templatesTypes";

// ─── useTemplates ─────────────────────────────────────────────────────────────
// Fetches the public template list with optional filters.
// Use on the /templates listing page (client-side filtering/pagination).

interface UseTemplatesReturn {
    templates: TemplateListItem[];
    pagination: Pagination | null;
    isLoading: boolean;
    error: Error | null;
}

export function useTemplates(params?: TemplateListParams): UseTemplatesReturn {
    // Stable cache key — stringify params so SWR detects changes
    const key = ["templates", JSON.stringify(params ?? {})];

    const { data, error, isLoading } = useSWR(
        key,
        () => fetchTemplates(params),
        { revalidateOnFocus: false },
    );

    return {
        templates: data?.data ?? [],
        pagination: data?.pagination ?? null,
        isLoading,
        error: error ?? null,
    };
}

// ─── useTemplate ──────────────────────────────────────────────────────────────
// Fetches a single template by slug.
// Use in the detail drawer or detail page.

interface UseTemplateReturn {
    template: TemplateFull | null;
    isLoading: boolean;
    error: Error | null;
}

export function useTemplate(slug: string | null): UseTemplateReturn {
    const { data, error, isLoading } = useSWR(
        slug ? ["template", slug] : null,   // null = skip fetch if no slug
        () => fetchTemplateBySlug(slug!),
        { revalidateOnFocus: false },
    );

    return {
        template: data?.data ?? null,
        isLoading,
        error: error ?? null,
    };
}

// ─── useTemplateCategories ────────────────────────────────────────────────────

interface UseCategoriesReturn {
    categories: TemplateCategory[];
    isLoading: boolean;
    error: Error | null;
}

export function useTemplateCategories(): UseCategoriesReturn {
    const { data, error, isLoading } = useSWR(
        "template-categories",
        fetchCategories,
        { revalidateOnFocus: false, dedupingInterval: 60_000 },
    );

    return {
        categories: data?.data ?? [],
        isLoading,
        error: error ?? null,
    };
}