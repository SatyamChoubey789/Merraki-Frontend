import type { Metadata } from 'next';
import RunwayCalculatorPage from "@/components/sections/calculators/RunwayCalculator";

export const metadata: Metadata = {
  title: 'Runway Calculator',
  description: 'Calculate your startup runway with our easy-to-use calculator. Input your current cash balance and monthly burn rate, and we will help you determine how many months you have before you run out of cash.',
};

export default function RunwayCalculator() {
  return (
    <RunwayCalculatorPage />
  );
}