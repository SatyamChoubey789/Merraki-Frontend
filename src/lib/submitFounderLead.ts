"use client";

import type { TestResult } from "@/lib/hooks/useFounderTestEngine";

interface ContactInfo {
  name: string;
  email: string;
  company?: string;
  role?: string;
}

const API_BASE = "https://api.merrakisolutions.com/api/v1/public";

/**
 * Persists the completed founder test (contact + scored result) to the
 * backend DB via POST /founders-test/submit.
 *
 * Throws on failure — caller should treat this as fire-and-forget so a
 * backend hiccup never blocks the user from seeing their results.
 */
export async function submitFounderLead(
  contact: ContactInfo,
  result: TestResult,
) {
  const payload = {
    name: contact.name,
    email: contact.email,
    company: contact.company || "",
    role: contact.role || "",
    total_score: result.totalScore,
    total_max: result.totalMax,
    personality_type: result.personalityType,
    personality_title: result.personalityTitle,
    personality_badge: result.personalityBadge,
    personality_color: result.personalityColor,
    personality_description: result.personalityDescription,
    section_scores: result.scores.map((s) => ({
      dimension: s.dimension,
      label: s.label,
      score: s.score,
      max: s.max,
      percentage: s.percentage,
    })),
  };

  const res = await fetch(`${API_BASE}/founders-test/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`submitFounderLead failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<{ success: boolean; data: unknown }>;
}
