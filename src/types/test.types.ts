export type QuestionType = 'single' | 'multiple' | 'scale';

export interface TestOption {
  id: string;
  label: string;
  value: string;
  weight: Record<string, number>;
}

export interface TestQuestion {
  id: string;
  order: number;
  question: string;
  description?: string;
  type: QuestionType;
  options: TestOption[];
  category: string;
  isRequired: boolean;
}

export interface TestAnswer {
  questionId: string;
  optionIds: string[];
}

export interface TestSubmitPayload {
  answers: TestAnswer[];
  contactInfo: {
    name: string;
    email: string;
    company?: string;
    role?: string;
  };
}

export type PersonalityType =
  | 'strategic_visionary'
  | 'analytical_optimizer'
  | 'growth_accelerator'
  | 'cautious_builder'
  | 'dynamic_innovator';

export interface PersonalityScore {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  label: string;
}

export interface TestResult {
  testNumber: string;
  personalityType: PersonalityType;
  personalityTitle: string;
  personalityDescription: string;
  scores: PersonalityScore[];
  strengths: string[];
  riskAreas: string[];
  growthSuggestions: string[];
  recommendedTemplates: string[];
  createdAt: string;
}

export interface TestSubmitResponse {
  testNumber: string;
  result: TestResult;
}