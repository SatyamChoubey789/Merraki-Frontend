// ─── Matched to backend: `jobs` table + GET /api/jobs ────────────────────────
//
// The public endpoint returns whole job rows. One difference from the raw row:
// `applyUrl` is already RESOLVED by the backend — the job's own link, else the
// company-wide link, else null. So null means neither is configured.

export interface JobListing {
  id: string;                    // UUID
  title: string;
  slug: string;                  // stable on edit; use for a /careers/[slug] page
  team: string;
  type: string;                  // free text, e.g. "Full-time"
  location: string;              // free text, e.g. "Remote"
  description: unknown | null;   // TipTap JSON (same format as blog content)
  requirements: string[] | null;
  applyUrl: string | null;
  isActive: boolean;             // public endpoints only return true
  displayOrder: number;          // list is already sorted by this, then newest
  createdAt: string;             // ISO timestamp
  updatedAt: string;
}

// ─── Response envelopes ───────────────────────────────────────────────────────

export interface JobListResponse {
  success: true;
  data: JobListing[];
}

export interface JobResponse {
  success: true;
  data: JobListing;
}