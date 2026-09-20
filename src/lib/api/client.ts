const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export interface ApiSuccess<T> {
    success: true;
    data: T;
}

export interface ApiList<T> {
    success: true;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Server fetch (for React Server Components) ────────────────────────────────
// Uses Next.js native fetch with ISR caching

export async function apiFetch<T>(
    path: string,
    options?: {
        revalidate?: number | false;    // seconds — false = no cache
        tags?: string[];
        params?: Record<string, string | number | boolean | undefined>;
    }
): Promise<T> {
    const url = new URL(`${API_URL}${path}`);

    // Append query params cleanly
    if (options?.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== "" && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), {
        next:
            options?.revalidate === false
                ? { revalidate: 0 }
                : {
                    revalidate: options?.revalidate ?? 60,
                    tags: options?.tags,
                },
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        let errorBody: ApiError | null = null;
        try {
            errorBody = await res.json();
        } catch { }
        throw new Error(
            errorBody?.error?.message ?? `API error: ${res.status} ${res.statusText}`
        );
    }

    return res.json() as Promise<T>;
}

// ── Client-side Axios instance (for mutations from Client Components) ─────────

import axios from "axios";

export const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: false,     // public site — no auth cookies
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
});

// Response interceptor — normalize error messages
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.error?.message ||
            error.message ||
            "Something went wrong";
        return Promise.reject(new Error(message));
    }
);