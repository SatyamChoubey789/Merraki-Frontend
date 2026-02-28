import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TestAnswer } from "@/types/test.types";
import type { FounderTestContactValues } from "@/lib/schemas/founderTest.schema";

interface FounderTestState {
  answers: TestAnswer[];
  currentQuestionIndex: number;
  contactInfo: FounderTestContactValues | null;
  lastTestNumber: string | null;
  startedAt: string | null;
}

interface FounderTestActions {
  saveAnswer: (answer: TestAnswer) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setContactInfo: (info: FounderTestContactValues) => void;
  setLastTestNumber: (testNumber: string) => void;
  resetTest: () => void;
}

type FounderTestStore = FounderTestState & FounderTestActions;

const initialState: FounderTestState = {
  answers: [],
  currentQuestionIndex: 0,
  contactInfo: null,
  lastTestNumber: null,
  startedAt: null,
};

export const useFounderTestStore = create<FounderTestStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      saveAnswer: (answer: TestAnswer) => {
        const answers = get().answers;
        const existingIndex = answers.findIndex(
          (a) => a.questionId === answer.questionId,
        );

        if (existingIndex >= 0) {
          const updated = [...answers];
          updated[existingIndex] = answer;
          set({
            answers: updated,
            startedAt: get().startedAt ?? new Date().toISOString(),
          });
        } else {
          set({
            answers: [...answers, answer],
            startedAt: get().startedAt ?? new Date().toISOString(),
          });
        }
      },

      setCurrentQuestionIndex: (index: number) =>
        set({ currentQuestionIndex: index }),

      setContactInfo: (info: FounderTestContactValues) =>
        set({ contactInfo: info }),

      setLastTestNumber: (testNumber: string) =>
        set({ lastTestNumber: testNumber }),

      resetTest: () => set(initialState),
    }),
    {
      name: "merraki-founder-test",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
