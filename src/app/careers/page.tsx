import type { Metadata } from "next";
import { getJobs } from "@/lib/api/jobs";
import CareersPageClient from "@/components/sections/careers/Careerspageclient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Merraki Solutions for people who think in numbers, solve with clarity, and build with purpose.",
};

// Re-check the jobs API at most once a minute
export const revalidate = 60;

export default async function CareersPage() {
  // Server-rendered list: instant first paint and indexable by search engines.
  // The client component then refreshes it through useJobs().
  const initialRoles = await getJobs();
  return <CareersPageClient roles={initialRoles} />;
}