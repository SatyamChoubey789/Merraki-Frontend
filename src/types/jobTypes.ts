// ─── Matched to backend: jobs table + GET /api/jobs ──────────────────────────
//
// The public endpoint returns full job rows (same columns as the DB), with one
// difference: `applyUrl` already has the company-wide fallback applied
// (job.applyUrl || companyApplyUrl || null), so null means neither is set.

export interface JobListing {
  id: string;                      // UUID
  title: string;
  slug: string;                    // for a future /careers/[slug] detail page
  team: string;
  type: string;                    // free text, e.g. "Full-time"
  location: string;                // free text, e.g. "Remote"
  description: unknown | null;     // TipTap JSON (same format as blog content)
  requirements: string[] | null;
  applyUrl: string | null;
  isActive: boolean;               // public endpoint only returns true
  displayOrder: number;            // backend already sorts by this
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  success: true;
  data: JobListing[];
}