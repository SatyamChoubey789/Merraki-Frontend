import type { Metadata } from 'next';
import ValuationCalculatorPage from "@/components/sections/calculators/ValuationCalculator";

export const metadata: Metadata = {
  title: 'Valuation Calculator',
  description: 'Determine the value of your business with our comprehensive valuation calculator. Input your financial data and receive an accurate estimate of your company\'s worth.',
};

export default function ValuationCalculator() {
  return (
    <ValuationCalculatorPage />
  );
}