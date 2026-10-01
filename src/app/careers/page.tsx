import type { Metadata } from "next";
import { getJobs } from "@/lib/api/job";
import CareersPageClient from "@/components/sections/careers/Careerspageclient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Merraki Solutions — for people who think in numbers, solve with clarity, and build with purpose.",
};

// Re-check the jobs API at most once a minute
export const revalidate = 60;

export default async function CareersPage() {
  const roles = await getJobs();
  return <CareersPageClient roles={roles} />;
}