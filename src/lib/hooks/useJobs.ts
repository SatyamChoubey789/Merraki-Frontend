"use client";

import useSWR from "swr";
import { fetchJobs } from "@/lib/api/jobs";
import type { JobListing } from "@/types/jobTypes";

const EMPTY: JobListing[] = [];

interface UseJobsReturn {
    jobs: JobListing[];
    isLoading: boolean;
    error: Error | null;
    refresh: () => void;
}

// Pass the server-fetched list as `initialJobs`:
//   - the page renders instantly with real content (good for SEO, no spinner)
//   - SWR then refetches on mount, so admin changes show up without waiting for
//     the 60s page cache, and a page that was cached empty (API down at the
//     time) fills itself in
//   - if the client refetch fails, the initial list stays on screen
export function useJobs(initialJobs?: JobListing[]): UseJobsReturn {
    const { data, error, isLoading, mutate } = useSWR("jobs", fetchJobs, {
        fallbackData: initialJobs,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    return {
        jobs: data ?? EMPTY,
        isLoading,
        error: error ?? null,
        refresh: () => {
            void mutate();
        },
    };
}