import { apiFetch } from "./client";
import type { JobListResponse, JobListing } from "@/types/jobTypes";

// GET /api/jobs  →  { success: true, data: Job[] }
//
// NEXT_PUBLIC_API_URL already ends in /api (same base the templates and blog
// fetchers use), so the path here is just "/jobs".
//
// Backend returns active jobs only, already ordered by displayOrder then newest.
export async function getJobs(): Promise<JobListing[]> {
    try {
        const res = await apiFetch<JobListResponse>("/jobs", {
            revalidate: 60,
            tags: ["jobs"],
        });
        return res.data ?? [];
    } catch (err) {
        // A careers page should never 500. Fall back to the "no open roles" state.
        // The error is logged server-side so a bad base URL doesn't fail silently.
        console.error("[getJobs] failed:", err);
        return [];
    }
}