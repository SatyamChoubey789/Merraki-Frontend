import type { Metadata } from 'next';
import BreakevenCalculatorPage from "@/components/sections/calculators/BreakevenCalculator";

export const metadata: Metadata = {
  title: 'Breakeven Calculator',
  description: 'Calculate your breakeven point with our easy-to-use calculator. Input your fixed and variable costs, and we will help you determine how many units you need to sell to cover your expenses.',
};

export default function BreakevenCalculator() {
  return (
    <BreakevenCalculatorPage />
  );
}