"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { testApi } from "@/lib/api/test";
import type { TestSubmitPayload, TestAnswer } from "@/types/test.types";

export const TEST_KEYS = {
  all: ["test"] as const,
  questions: () => [...TEST_KEYS.all, "questions"] as const,
  result: (testNumber: string) =>
    [...TEST_KEYS.all, "result", testNumber] as const,
};

export function useTestQuestions() {
  return useQuery({
    queryKey: TEST_KEYS.questions(),
    queryFn: () => testApi.getQuestions(),
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
  });
}

export function useSubmitTest(onSuccess?: (testNumber: string) => void) {
  return useMutation({
    mutationFn: (payload: TestSubmitPayload) => testApi.submit(payload),
    onSuccess: (data) => {
      onSuccess?.(data.data.testNumber);
    },
  });
}

export function useTestResult(testNumber: string) {
  return useQuery({
    queryKey: TEST_KEYS.result(testNumber),
    queryFn: () => testApi.getResults(testNumber),
    enabled: !!testNumber,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
}
