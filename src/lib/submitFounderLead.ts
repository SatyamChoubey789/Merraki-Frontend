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
  const flatAnswers: Record<string, string> = {}

  Object.entries(rawAnswers).forEach(([qId, selectedIds]) => {
    if (selectedIds.length === 0) return

    const question = QUESTIONS.find((q) => q.id === qId)
    if (!question) return

    if (question.type === "scale") {
      // Scale: store the numeric value (1–10)
      const opt = question.options.find((o) => o.id === selectedIds[0])
      flatAnswers[qId] = opt?.value ?? selectedIds[0]
    } else {
      // Single / multiple: store full option label text for readability
      const opt = question.options.find((o) => o.id === selectedIds[0])
      flatAnswers[qId] = opt?.label ?? selectedIds[0]
    }
  })

  const payload: SubmitPayload = {
    leadName: contact.name,
    leadEmail: contact.email,
    leadCompany: contact.company || undefined,
    answers: flatAnswers,
    resultType: result.personalityType,
    score: result.totalScore,
  }

  await apiClient.post("/founder-test/submit", payload)
}