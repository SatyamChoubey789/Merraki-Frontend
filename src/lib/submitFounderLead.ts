import { apiClient } from "./api/client"
import type { TestResult } from "./hooks/useFounderTestEngine"
import { QUESTIONS } from "./hooks/useFounderTestEngine"

interface ContactInfo {
  name: string
  email: string
  company?: string
  role?: string
}

interface SubmitPayload {
  leadName: string
  leadEmail: string
  leadCompany?: string
  answers: Record<string, string>
  resultType: string
  score: number
}

export async function submitFounderLead(
  contact: ContactInfo,
  result: TestResult,
  rawAnswers: Record<string, string[]>
): Promise<void> {
  const flatAnswers: Record<string, string> = {};

  Object.entries(rawAnswers).forEach(([qId, selectedIds]) => {
    if (selectedIds.length === 0) return;

    const question = QUESTIONS.find((q) => q.id === qId);
    if (!question) return;

    // Always resolve to option.value — that's what backend z.enum expects
    // selectedIds contains option.id (e.g. "q1a"), need option.value (e.g. "a")
    const opt = question.options.find((o) => o.id === selectedIds[0]);
    flatAnswers[qId] = opt?.value ?? selectedIds[0];
  });

  const payload = {
    leadName: contact.name,
    leadEmail: contact.email,
    leadCompany: contact.company || undefined,
    answers: flatAnswers,
  };

  // resultType and score are NOT in the backend submitTestSchema
  // Backend computes them itself from answers — remove them from payload
  await apiClient.post("/founder-test/submit", payload);
}