// lib/hooks/useFounderTestEngine.ts
"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import {
  fetchFounderQuestions,
  submitFounderTest,
  type FounderQuestion,
  type FounderContact,
  type TestResult,
} from "@/lib/api/founderTest";

// Re-exported so existing imports (TestResultsScreen, notifyLead, PDF generator…)
// keep working without changes.
export type {
  FounderQuestion as Question,
  QuestionType,
  SectionScore,
  TestResult,
} from "@/lib/api/founderTest";

// Archetypes are admin-defined in the DB now, so this is no longer a fixed union.
export type PersonalityType = string;

export type Step = "intro" | "questions" | "contact" | "submitting" | "results";

// The backend answers in ~300ms, but the "Generating your report…" screen is a
// designed moment. Request and delay run in parallel, so the wait is
// max(request, MIN_SUBMIT_MS) — not the sum. Lower this to speed things up.
const MIN_SUBMIT_MS = 5200;

const EMPTY: FounderQuestion[] = [];

export function useFounderTestEngine() {
  // ── Questions come from the backend (admin-editable) ──────────────────────
  const {
    data,
    error: loadError,
    isLoading,
  } = useSWR("founder-test-questions", fetchFounderQuestions, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const questions = data ?? EMPTY;
  const totalQuestions = questions.length;

  // ── Flow state ─────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("intro");
  const [qIndex, setQIndex] = useState(0);
  // questionKey → selected option VALUE (what the backend validates)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<FounderContact | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[qIndex] ?? null;

  const getCurrentAnswer = useCallback(
    (qId: string): string | undefined => answers[qId],
    [answers],
  );

  const handleAnswer = useCallback((qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  // Every question is required — the backend rejects a submission with gaps.
  const canProceed = useCallback(
    () => Boolean(currentQuestion && answers[currentQuestion.id]),
    [currentQuestion, answers],
  );

  const handleStart = useCallback(() => {
    if (totalQuestions === 0) return;
    setStep("questions");
    setQIndex(0);
  }, [totalQuestions]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;
    if (qIndex < totalQuestions - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("contact");
    }
  }, [qIndex, totalQuestions, canProceed]);

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

  // ── Submit: the backend scores, picks the archetype, and saves the lead ───
  const handleContactSubmit = useCallback(
    async (form: FounderContact) => {
      setContact(form);
      setSubmitError(null);
      setStep("submitting");

      try {
        const [computed] = await Promise.all([
          submitFounderTest(form, answers),
          new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_MS)),
        ]);
        setResult(computed);
        setStep("results");
      } catch (err) {
        // A failed save must NOT show results: the lead would be lost silently.
        // Go back to the form with the error so they can retry.
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
        setStep("contact");
      }
    },
    [answers],
  );

  const progress =
    totalQuestions > 0 ? Math.round((qIndex / totalQuestions) * 100) : 0;

  return {
    // state
    currentStep: step,
    currentQuestion,
    currentQuestionIndex: qIndex,
    totalQuestions,
    progress,
    contact,
    result,
    isLoading,
    // Also an error if the backend has zero active questions — nothing to run.
    isError: Boolean(loadError) || (!isLoading && totalQuestions === 0),
    isSubmitting: step === "submitting",
    submitError,
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