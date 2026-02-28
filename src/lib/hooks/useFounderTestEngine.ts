'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTestQuestions, useSubmitTest } from './useFounderTest';
import { useUiStore } from '@/lib/stores/uiStore';
import type { TestAnswer, TestQuestion, PersonalityType } from '@/types/test.types';
import type { FounderTestContactValues } from '@/lib/schemas/founderTest.schema';

type TestStep = 'intro' | 'questions' | 'contact' | 'submitting' | 'results';

export function useFounderTestEngine() {
  const router = useRouter();
  const { addToast } = useUiStore();

  const [currentStep, setCurrentStep] = useState<TestStep>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [contactInfo, setContactInfo] = useState<FounderTestContactValues | null>(null);

  const { data: questionsData, isLoading, isError } = useTestQuestions();
  const questions = questionsData?.data ?? [];

  const submitMutation = useSubmitTest((testNumber) => {
    router.push(`/founder-test/results/${testNumber}`);
  });

  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0
      ? Math.round((currentQuestionIndex / totalQuestions) * 100)
      : 0;

  const currentQuestion: TestQuestion | null =
    questions[currentQuestionIndex] ?? null;

  const getCurrentAnswer = useCallback(
    (questionId: string): string[] => {
      return (
        answers.find((a) => a.questionId === questionId)?.optionIds ?? []
      );
    },
    [answers]
  );

  const handleAnswer = useCallback(
    (questionId: string, optionId: string, type: 'single' | 'multiple' | 'scale') => {
      setAnswers((prev) => {
        const existing = prev.findIndex((a) => a.questionId === questionId);

        if (type === 'single' || type === 'scale') {
          const newAnswer: TestAnswer = { questionId, optionIds: [optionId] };
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newAnswer;
            return updated;
          }
          return [...prev, newAnswer];
        }

        // multiple
        const currentOptionIds =
          existing >= 0 ? [...prev[existing].optionIds] : [];
        const optionIndex = currentOptionIds.indexOf(optionId);

        const newOptionIds =
          optionIndex >= 0
            ? currentOptionIds.filter((id) => id !== optionId)
            : [...currentOptionIds, optionId];

        const newAnswer: TestAnswer = { questionId, optionIds: newOptionIds };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = newAnswer;
          return updated;
        }
        return [...prev, newAnswer];
      });
    },
    []
  );

  const canProceed = useCallback((): boolean => {
    if (!currentQuestion) return false;
    if (!currentQuestion.isRequired) return true;
    const answer = answers.find((a) => a.questionId === currentQuestion.id);
    return (answer?.optionIds.length ?? 0) > 0;
  }, [currentQuestion, answers]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setCurrentStep('contact');
    }
  }, [canProceed, currentQuestionIndex, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
    } else {
      setCurrentStep('intro');
    }
  }, [currentQuestionIndex]);

  const handleStart = useCallback(() => {
    setCurrentStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  }, []);

  const handleContactSubmit = useCallback(
    async (contact: FounderTestContactValues) => {
      setContactInfo(contact);
      setCurrentStep('submitting');

      try {
        await submitMutation.mutateAsync({
          answers,
          contactInfo: {
            name: contact.name,
            email: contact.email,
            company: contact.company || undefined,
            role: contact.role || undefined,
          },
        });
      } catch {
        addToast({
          type: 'error',
          message: 'Submission failed. Please try again.',
        });
        setCurrentStep('contact');
      }
    },
    [answers, submitMutation, addToast]
  );

  const isAnswered = useCallback(
    (questionId: string): boolean => {
      const answer = answers.find((a) => a.questionId === questionId);
      return (answer?.optionIds.length ?? 0) > 0;
    },
    [answers]
  );

  return {
    // State
    currentStep,
    currentQuestionIndex,
    currentQuestion,
    questions,
    answers,
    contactInfo,
    progress,
    totalQuestions,

    // Loading states
    isLoading,
    isError,
    isSubmitting: submitMutation.isPending,

    // Actions
    handleStart,
    handleAnswer,
    handleNext,
    handlePrev,
    handleContactSubmit,

    // Helpers
    canProceed,
    getCurrentAnswer,
    isAnswered,
  };
}