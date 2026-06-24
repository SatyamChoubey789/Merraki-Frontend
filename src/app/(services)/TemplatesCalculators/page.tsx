import TemplatesCalculators from "@/components/sections/services/TemplatesCalculators";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Financial Templates & Calculators | Merraki",
  description: "Access a wide range of free financial templates and calculators with Merraki. From financial modeling templates to valuation calculators, we provide the tools you need to make informed business decisions.",
};

export default function TemplatesCalculatorsPage() {
  return <TemplatesCalculators />;
}