import type { Metadata } from 'next';
import ProfitMarginCalculatorPage from "@/components/sections/calculators/ProfitMarginCalculator";

export const metadata: Metadata = {
  title: 'Profit Margin Calculator',
  description: 'Calculate your gross, operating, and net profit margins with our easy-to-use calculator.',
};

export default function ProfitMarginCalculator() {
  return (
    <ProfitMarginCalculatorPage />
  );
}