import { apiFetch, apiClient } from "./client";
import type { JobListing, JobListResponse } from "@/types/jobTypes";

// GET /api/jobs  →  { success: true, data: Job[] }
//
// NEXT_PUBLIC_API_URL already ends in /api (same base as templates and blog),
// so the path is just "/jobs".

// ─── Server fetcher (RSC + ISR) — used by the careers page ───────────────────
// Never throws: a careers page should not 500 because the API hiccupped.
// Falls back to [] and logs, so a bad base URL doesn't fail silently.

export async function getJobs(): Promise<JobListing[]> {
  try {
    const res = await apiFetch<JobListResponse>("/jobs", {
      revalidate: 60,
      tags: ["jobs"],
    });
    return res.data ?? [];
  } catch (err) {
    console.error("[getJobs] failed:", err);
    return [];
  }
}

// ─── Client fetcher — used by the useJobs hook ───────────────────────────────
// Throws on failure so SWR can surface `error` and keep showing its last data.

export async function fetchJobs(): Promise<JobListing[]> {
  const res = await apiClient.get<JobListResponse>("/jobs");
  return res.data.data;
}