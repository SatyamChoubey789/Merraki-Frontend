import { apiClient } from "./client";

// ─── Matched to backend: GET /api/founder-test/questions ─────────────────────
// Questions live in the DB (admin-editable). `id` is the backend's questionKey
// ("q1", "q2", …) and is the key used in the `answers` payload. Scores are
// never sent to the public, so the frontend cannot compute results itself.

export type QuestionType = "single" | "scale";

export interface FounderQuestionOption {
    value: string; // 'a' | 'b' | … or '1'..'10' for scale — this is what gets submitted
    label: string;
}

export interface FounderQuestion {
    id: string;
    section: string;
    sectionLabel: string;
    category: string;
    question: string;
    description: string | null;
    type: QuestionType;
    options: FounderQuestionOption[];
}

// ─── Matched to backend: POST /api/founder-test/submit ───────────────────────

export interface SectionScore {
    dimension: string;
    label: string;
    score: number;
    max: number;
    percentage: number;
}

interface SubmitResponseData {
    resultId: string;
    resultType: string;
    title: string;
    badge: string;
    color: string;
    description: string;
    message: string;
    traits: string[];
    strengths: string[];
    growthSuggestions: string[];
    riskAreas: string[];
    score: number;
    totalMax: number;
    sectionScores: SectionScore[];
}

// ─── Shape the result screens + PDF generator already consume ────────────────

export interface TestResult {
    totalScore: number;
    totalMax: number;
    personalityType: string; // archetypeKey — any string now, admin can add archetypes
    personalityTitle: string;
    personalityBadge: string;
    personalityColor: string;
    personalityDescription: string;
    message: string;
    traits: string[];
    strengths: string[];
    growthSuggestions: string[];
    riskAreas: string[];
    scores: SectionScore[];
    sectionFeedback: Record<string, string>;
}

export interface FounderContact {
    name: string;
    email: string;
    company?: string;
    role?: string; // collected in the form, but the backend has no column for it
}

// ─── Adapter ──────────────────────────────────────────────────────────────────

const SAFE_COLOR = "#818CF8";

// The screens build translucent tints with `${color}18`, which only works for
// 6-digit hex. Admin-entered colors like "red" would silently break that.
function safeColor(color: string | null | undefined): string {
    return color && /^#[0-9a-f]{6}$/i.test(color) ? color : SAFE_COLOR;
}

function feedbackFor(s: SectionScore): string {
    if (s.percentage < 50) return `${s.label} needs immediate attention.`;
    if (s.percentage < 75) return `${s.label} is developing — keep building.`;
    return `${s.label} is strong. Maintain this discipline.`;
}

function adaptResult(r: SubmitResponseData): TestResult {
    const sectionFeedback: Record<string, string> = {};
    r.sectionScores.forEach((s) => {
        sectionFeedback[s.dimension] = feedbackFor(s);
    });

    return {
        totalScore: r.score,
        totalMax: r.totalMax,
        personalityType: r.resultType,
        personalityTitle: r.title,
        personalityBadge: r.badge ?? "",
        personalityColor: safeColor(r.color),
        personalityDescription: r.description,
        message: r.message,
        traits: r.traits ?? [],
        strengths: r.strengths ?? [],
        growthSuggestions: r.growthSuggestions ?? [],
        riskAreas: r.riskAreas ?? [],
        scores: r.sectionScores,
        sectionFeedback,
    };
}

// ─── Fetchers (client-side, via axios apiClient) ─────────────────────────────

export async function fetchFounderQuestions(): Promise<FounderQuestion[]> {
    const res = await apiClient.get<{ success: true; data: FounderQuestion[] }>(
        "/founder-test/questions",
    );
    return res.data.data;
}

// `answers` maps questionKey → option VALUE, e.g. { q1: "a", q8: "7" }.
// The backend validates every active question is answered, scores it, picks the
// archetype, saves the lead, and returns the full result.
export async function submitFounderTest(
    contact: FounderContact,
    answers: Record<string, string>,
): Promise<TestResult> {
    const res = await apiClient.post<{ success: true; data: SubmitResponseData }>(
        "/founder-test/submit",
        {
            leadName: contact.name,
            leadEmail: contact.email,
            leadCompany: contact.company?.trim() || undefined,
            answers,
        },
    );
    return adaptResult(res.data.data);
}