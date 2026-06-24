import SolutionsPage from "@/components/sections/services/Solutions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions | Merraki",
  description:
    "Explore Merraki's comprehensive financial solutions, including financial modelling, valuation, pitch decks, data analysis, templates, and founder consulting services.",
};

export default function Solutions() {
  return <SolutionsPage />;
}