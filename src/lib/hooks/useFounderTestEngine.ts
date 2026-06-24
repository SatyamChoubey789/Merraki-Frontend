// lib/hooks/useFounderTestEngine.ts
"use client";

import { useState, useCallback } from "react";
import { submitFounderLead } from "@/lib/submitFounderLead";

/* ── Types ────────────────────────────────────────── */
export type QuestionType = "single" | "multiple" | "scale";

export interface Option {
  id: string;
  label: string;
  value: string;
  points: number;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  options: Option[];
}

export type Step = "intro" | "questions" | "contact" | "submitting" | "results";

export interface SectionScore {
  dimension: string;
  label: string;
  score: number;
  max: number;
  percentage: number;
}

export interface TestResult {
  totalScore: number;
  totalMax: number;
  personalityType: PersonalityType;
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

export type PersonalityType =
  | "blindfolded_founder"
  | "hustler_rough_numbers"
  | "structured_operator"
  | "finance_savvy_builder"
  | "investor_ready_ceo";

/* ── Questions ───────────────────────────────────── */
export const QUESTIONS: Question[] = [
  // ─ Section 1: Cash & Runway ─
  {
    id: "q1",
    category: "Cash & Runway Management",
    question: "Do you know your monthly burn rate?",
    description: "How much cash your business spends every month",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q1a",
        label: "I track it regularly and know the exact number",
        value: "a",
        points: 10,
      },
      {
        id: "q1b",
        label: "I have a rough idea but don't review it often",
        value: "b",
        points: 5,
      },
      { id: "q1c", label: "I don't really track this", value: "c", points: 0 },
    ],
  },
  {
    id: "q2",
    category: "Cash & Runway Management",
    question: "Do you track your cash runway?",
    description: "How many months your current cash will last",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q2a",
        label: "I update this regularly and use it for planning",
        value: "a",
        points: 10,
      },
      { id: "q2b", label: "I check it occasionally", value: "b", points: 5 },
      { id: "q2c", label: "I don't track this at all", value: "c", points: 0 },
    ],
  },
  // ─ Section 2: Planning & Forecasting ─
  {
    id: "q3",
    category: "Financial Planning & Forecasting",
    question: "Do you have a structured 12+ month financial forecast?",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q3a",
        label: "Yes — a detailed financial model",
        value: "a",
        points: 10,
      },
      {
        id: "q3b",
        label: "Rough projections in a spreadsheet",
        value: "b",
        points: 5,
      },
      { id: "q3c", label: "No formal forecast exists", value: "c", points: 0 },
    ],
  },
  {
    id: "q4",
    category: "Financial Planning & Forecasting",
    question: "Do you compare Actual vs Plan every month?",
    description: "Reviewing real numbers against your plan to find gaps",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q4a",
        label: "Every month — I review variances and act on them",
        value: "a",
        points: 10,
      },
      {
        id: "q4b",
        label: "Sometimes, but not consistently",
        value: "b",
        points: 5,
      },
      { id: "q4c", label: "Rarely or never", value: "c", points: 0 },
    ],
  },
  // ─ Section 3: Unit Economics ─
  {
    id: "q5",
    category: "Unit Economics & Profitability",
    question: "Do you know your unit economics?",
    description:
      "CAC (Customer Acquisition Cost), LTV (Lifetime Value), gross margins",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q5a",
        label: "Yes — I know CAC, LTV, and gross margins precisely",
        value: "a",
        points: 10,
      },
      {
        id: "q5b",
        label: "I know total marketing spend and revenue, roughly",
        value: "b",
        points: 5,
      },
      {
        id: "q5c",
        label: "I have no idea about these numbers",
        value: "c",
        points: 0,
      },
    ],
  },
  {
    id: "q6",
    category: "Unit Economics & Profitability",
    question: "Do you know your break-even point?",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q6a",
        label: "Yes — I know break-even units and break-even month",
        value: "a",
        points: 10,
      },
      { id: "q6b", label: "I have a rough idea", value: "b", points: 5 },
      { id: "q6c", label: "Not really", value: "c", points: 0 },
      {
        id: "q6d",
        label: "I didn't know this was a thing",
        value: "d",
        points: 0,
      },
    ],
  },
  // ─ Section 4: Controls & Reporting ─
  {
    id: "q7",
    category: "Financial Controls & Reporting",
    question:
      "Do you maintain monthly P&L, Balance Sheet, and Cash Flow statements?",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q7a",
        label: "Yes — maintained weekly or monthly",
        value: "a",
        points: 10,
      },
      {
        id: "q7b",
        label: "We have a P&L but not the rest",
        value: "b",
        points: 5,
      },
      {
        id: "q7c",
        label: "Our CA handles it for tax purposes only",
        value: "c",
        points: 2,
      },
      {
        id: "q7d",
        label: "We have no financial statements",
        value: "d",
        points: 0,
      },
    ],
  },
  {
    id: "q8",
    category: "Financial Controls & Reporting",
    question: "How thoroughly do you record transactions?",
    description:
      "Scale of 1 (only big transactions) to 10 (every rupee tracked)",
    type: "scale",
    isRequired: true,
    options: Array.from({ length: 10 }, (_, i) => ({
      id: `q8_${i + 1}`,
      label:
        i === 0
          ? "Only big transactions"
          : i === 9
            ? "Every rupee"
            : `${i + 1}`,
      value: String(i + 1),
      points: i < 3 ? 0 : i < 6 ? 5 : 10,
    })),
  },
  // ─ Section 5: Fundraising ─
  {
    id: "q9",
    category: "Fundraising & Investor Readiness",
    question: "Can you confidently explain your numbers to an investor?",
    description: "Valuation, revenue, EBITDA, PAT, unit economics",
    type: "single",
    isRequired: true,
    options: [
      {
        id: "q9a",
        label: "Completely — I can explain everything confidently",
        value: "a",
        points: 10,
      },
      {
        id: "q9b",
        label: "I know some of it, but need a lot of prep",
        value: "b",
        points: 5,
      },
      {
        id: "q9c",
        label: "Stressed — significant work needed before any meeting",
        value: "c",
        points: 2,
      },
      { id: "q9d", label: "Not ready at all", value: "d", points: 0 },
    ],
  },
  {
    id: "q10",
    category: "Fundraising & Investor Readiness",
    question: "Do you have an investor-ready financial model or pitch deck?",
    type: "single",
    isRequired: true,
    options: [
      { id: "q10a", label: "Yes — fully prepared", value: "a", points: 10 },
      { id: "q10b", label: "Work in progress", value: "b", points: 5 },
      { id: "q10c", label: "No — I need to build one", value: "c", points: 0 },
    ],
  },
];

/* ── Scoring ─────────────────────────────────────── */
const SECTIONS: { key: string; label: string; questionIds: string[] }[] = [
  { key: "cash", label: "Cash Management", questionIds: ["q1", "q2"] },
  {
    key: "planning",
    label: "Planning & Forecasting",
    questionIds: ["q3", "q4"],
  },
  { key: "unit_econ", label: "Unit Economics", questionIds: ["q5", "q6"] },
  { key: "controls", label: "Controls & Reporting", questionIds: ["q7", "q8"] },
  {
    key: "fundraising",
    label: "Fundraising Readiness",
    questionIds: ["q9", "q10"],
  },
];

const PERSONALITIES: Record<
  PersonalityType,
  {
    title: string;
    badge: string;
    color: string;
    description: string;
    message: string;
    traits: string[];
    strengths: string[];
    growth: string[];
    risks: string[];
  }
> = {
  blindfolded_founder: {
    title: "The Blindfolded Founder",
    badge: "🟥",
    color: "#DC2626",
    description:
      "Running on gut feeling with little visibility on cash, costs, or runway. High risk of sudden cash crunch.",
    message:
      "You're building something ambitious, but right now you're driving without a dashboard. The good news? This is fixable — fast. Once you start tracking cash, costs, and basic metrics, your stress will drop and your decisions will get sharper. Finance isn't here to slow you down — it's here to protect your dream.",
    traits: [
      "Runs on gut feeling",
      "Numbers feel scary or irrelevant",
      "No visibility on cash or runway",
      "High cash crunch risk",
    ],
    strengths: [
      "Bold decision-making speed",
      "Vision-driven execution",
      "Low analysis paralysis",
    ],
    growth: [
      "Start with a simple burn-rate tracker",
      "Set up a basic monthly P&L",
      "Learn your break-even number this week",
    ],
    risks: [
      "Unexpected cash shortfall",
      "Inability to raise funds",
      "No early warning system for trouble",
    ],
  },
  hustler_rough_numbers: {
    title: "The Hustler with Rough Numbers",
    badge: "🟠",
    color: "#D97706",
    description:
      "Knows some numbers but tracking is inconsistent. Decisions are partly data, partly instinct — reactive rather than proactive.",
    message:
      "You're doing many things right, but your finances are still running in 'jugaad mode.' With a bit more structure — forecasting, monthly reviews, and clarity on unit economics — you'll move from firefighting to actually planning your growth.",
    traits: [
      "Knows some numbers, not deeply",
      "Inconsistent tracking",
      "Partly data-driven, partly instinct",
      "Reactive with money",
    ],
    strengths: [
      "Hustle and speed",
      "Basic financial awareness",
      "Can read revenue trends",
    ],
    growth: [
      "Set up a 90-day cash forecast",
      "Track CAC and LTV for your top segment",
      "Do a monthly Actual vs Plan review",
    ],
    risks: [
      "Decisions made on incomplete data",
      "Missing growth levers hidden in numbers",
      "Investor conversations will be stressful",
    ],
  },
  structured_operator: {
    title: "The Structured Operator",
    badge: "🟡",
    color: "#D97706",
    description:
      "Decent systems in place. Tracks most key metrics and understands unit economics. Room to improve investor readiness.",
    message:
      "You're ahead of most founders already. Your numbers mostly make sense, and that's a big advantage. The next level is turning this into a real decision-making machine — tighter forecasts, cleaner reports, and sharper investor storytelling.",
    traits: [
      "Decent financial systems",
      "Tracks most key metrics",
      "Understands unit economics and runway",
      "Investor readiness still needs polish",
    ],
    strengths: [
      "Systematic financial thinking",
      "Can explain core metrics",
      "Monthly review discipline",
    ],
    growth: [
      "Build a 12-month rolling forecast",
      "Create an investor-ready one-pager",
      "Deepen unit economics analysis by channel",
    ],
    risks: [
      "Forecast may lack scenario planning",
      "Reporting not yet board-ready",
      "Missing narrative around the numbers",
    ],
  },
  finance_savvy_builder: {
    title: "The Finance-Savvy Builder",
    badge: "🟢",
    color: "#059669",
    description:
      "Good control over cash, metrics, and planning. Regular reviews and structured thinking. Investor conversations are manageable.",
    message:
      "You're running your business like a real operator, not just a dreamer. With a bit more polish in reporting, modeling, and narrative, you're very close to being fully investor-grade and scale-ready.",
    traits: [
      "Strong cash and metrics control",
      "Regular structured reviews",
      "Investor conversations manageable",
      "Thinks in systems",
    ],
    strengths: [
      "Financial discipline and consistency",
      "Strong unit economics awareness",
      "Proactive cash management",
    ],
    growth: [
      "Stress-test your model with 3 scenarios",
      "Build a board-ready reporting pack",
      "Sharpen your fundraising narrative",
    ],
    risks: [
      "May lack depth in investor storytelling",
      "Financial model may need scenario rigor",
      "Reporting cadence could be tighter",
    ],
  },
  investor_ready_ceo: {
    title: "The Investor-Ready CEO",
    badge: "🔵",
    color: "#1D4ED8",
    description:
      "Clear on cash, runway, unit economics, and profitability. Strong systems. Can confidently explain numbers to anyone. Ready to scale.",
    message:
      "You're playing the game at a professional level. Your numbers work for you, not against you. This puts you in a powerful position — to raise capital, scale smartly, and avoid the classic startup finance traps. Keep this discipline as you grow.",
    traits: [
      "Crystal clear on all key metrics",
      "Strong financial systems",
      "Investor-ready at any time",
      "Numbers drive every decision",
    ],
    strengths: [
      "Full-stack financial mastery",
      "Investor-grade communication",
      "Proactive risk management",
    ],
    growth: [
      "Automate your reporting stack",
      "Build investor update templates",
      "Mentor other founders on financial discipline",
    ],
    risks: [
      "Potential over-optimisation of metrics vs speed",
      "May slow decisions with too much analysis",
      "Keep the execution bias alive",
    ],
  },
};

function getPersonalityType(score: number): PersonalityType {
  if (score <= 30) return "blindfolded_founder";
  if (score <= 55) return "hustler_rough_numbers";
  if (score <= 75) return "structured_operator";
  if (score <= 90) return "finance_savvy_builder";
  return "investor_ready_ceo";
}

function computeResult(answers: Record<string, string[]>): TestResult {
  let totalScore = 0;
  const totalMax = QUESTIONS.length * 10;

  const sectionScores: SectionScore[] = SECTIONS.map((sec) => {
    let score = 0,
      max = 0;
    sec.questionIds.forEach((qId) => {
      const q = QUESTIONS.find((x) => x.id === qId)!;
      const selected = answers[qId] ?? [];
      const pts = selected.reduce((acc, id) => {
        const opt = q.options.find((o) => o.id === id);
        return acc + (opt?.points ?? 0);
      }, 0);
      score += pts;
      max += 10;
      totalScore += pts;
    });
    return {
      dimension: sec.key,
      label: sec.label,
      score,
      max,
      percentage: Math.round((score / max) * 100),
    };
  });

  const type = getPersonalityType(totalScore);
  const p = PERSONALITIES[type];

  const sectionFeedback: Record<string, string> = {};
  sectionScores.forEach((s) => {
    if (s.percentage < 50)
      sectionFeedback[s.dimension] = `${s.label} needs immediate attention.`;
    else if (s.percentage < 75)
      sectionFeedback[s.dimension] =
        `${s.label} is developing — keep building.`;
    else
      sectionFeedback[s.dimension] =
        `${s.label} is strong. Maintain this discipline.`;
  });

  return {
    totalScore,
    totalMax,
    personalityType: type,
    personalityTitle: p.title,
    personalityBadge: p.badge,
    personalityColor: p.color,
    personalityDescription: p.description,
    message: p.message,
    traits: p.traits,
    strengths: p.strengths,
    growthSuggestions: p.growth,
    riskAreas: p.risks,
    scores: sectionScores,
    sectionFeedback,
  };
}

/* ── Hook ────────────────────────────────────────── */
export function useFounderTestEngine() {
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [contact, setContact] = useState<{
    name: string;
    email: string;
    company?: string;
    role?: string;
  } | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = QUESTIONS[qIndex] ?? null;
  const totalQuestions = QUESTIONS.length;

  const getCurrentAnswer = useCallback(
    (qId: string) => answers[qId] ?? [],
    [answers],
  );

  const handleAnswer = useCallback(
    (qId: string, optionId: string, type: QuestionType) => {
      setAnswers((prev) => {
        if (type === "multiple") {
          const cur = prev[qId] ?? [];
          return {
            ...prev,
            [qId]: cur.includes(optionId)
              ? cur.filter((x) => x !== optionId)
              : [...cur, optionId],
          };
        }
        return { ...prev, [qId]: [optionId] };
      });
    },
    [],
  );

  const canProceed = useCallback(() => {
    if (!currentQuestion) return true;
    const sel = answers[currentQuestion.id] ?? [];
    return sel.length > 0;
  }, [currentQuestion, answers]);

  const handleStart = useCallback(() => {
    setStep("questions");
    setQIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion?.isRequired && !canProceed()) return;
    if (qIndex < totalQuestions - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("contact");
    }
  }, [qIndex, totalQuestions, canProceed, currentQuestion]);

  const handlePrev = useCallback(() => {
    if (step === "contact") {
      setStep("questions");
      setQIndex(totalQuestions - 1);
      return;
    }
    if (qIndex > 0) {
      setQIndex((i) => i - 1);
    } else {
      setStep("intro");
    }
  }, [step, qIndex, totalQuestions]);

  const handleContactSubmit = useCallback(
    async (data: any) => {
      setContact(data);
      setStep("submitting");
      setSubmitting(true);

      // Compute result locally (server can replace this in future)
      await new Promise((r) => setTimeout(r, 5200)); // match animation duration
      const computed = computeResult(answers);
      setResult(computed);

      // Persist lead + scored result to the backend DB.
      // Fire-and-forget: a backend/network failure must never block the
      // user from seeing their results.
      submitFounderLead(data, computed).catch((err) => {
        console.error("[useFounderTestEngine] submitFounderLead failed:", err);
      });

      setSubmitting(false);
      setStep("results");
    },
    [answers],
  );

  const progress = Math.round((qIndex / totalQuestions) * 100);

  return {
    // state
    currentStep: step,
    currentQuestion,
    currentQuestionIndex: qIndex,
    totalQuestions,
    progress,
    contact,
    result,
    isLoading: false,
    isError: false,
    isSubmitting: submitting,
    // actions
    getCurrentAnswer,
    handleAnswer,
    handleStart,
    handleNext,
    handlePrev,
    handleContactSubmit,
    canProceed,
    // raw
    answers,
  };
}
