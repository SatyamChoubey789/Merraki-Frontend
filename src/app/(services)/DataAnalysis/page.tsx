import DataAnalysisSection from "@/components/sections/services/DataAnalysis";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Analysis & Visualization Services | Merraki",
  description: "Unlock the power of your data with Merraki's Data Analysis & Visualization services. We help you create insightful dashboards, track KPIs, and generate custom reports to drive informed business decisions.",
};

export default function DataAnalysisPage() {
  return <DataAnalysisSection />;
}