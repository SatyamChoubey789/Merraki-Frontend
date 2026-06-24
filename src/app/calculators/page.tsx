import type { Metadata } from "next";
import CalculatorsSelectionPage from "@/components/sections/calculators/CalculatorsPageClient";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description:
    "Free financial calculators breakeven, startup valuation, profit margin, and runway. Instant results with visual charts.",
};

export default function CalculatorsPage() {
  return <CalculatorsSelectionPage />;
}
