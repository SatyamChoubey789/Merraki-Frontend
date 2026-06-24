// lib/notifyLead.ts
"use client";

import type { TestResult } from "@/lib/hooks/useFounderTestEngine";

interface ContactInfo {
  name: string;
  email: string;
  company?: string;
  role?: string;
}

/**
 * Fire-and-forget notification to the owner. Never throws, never blocks —
 * if this fails, the user's experience (seeing results / downloading the
 * PDF) is completely unaffected.
 */
export function notifyLead(
  event: "visit" | "pdf_export",
  contact: ContactInfo,
  result?: TestResult | null,
) {
  try {
    fetch("/api/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        role: contact.role,
        personalityTitle: result?.personalityTitle,
        totalScore: result?.totalScore,
        totalMax: result?.totalMax,
      }),
      // Lets the request continue even if the user navigates away right after
      keepalive: true,
    }).catch((err) => {
      console.error("[notifyLead] failed:", err);
    });
  } catch (err) {
    console.error("[notifyLead] failed to dispatch:", err);
  }
}
