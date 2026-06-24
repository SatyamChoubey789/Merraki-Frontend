import FinancialModellingSection from "@/components/sections/services/FinancialModelling";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Modelling Services | Merraki",
  description: "Merraki's financial modelling services turn your assumptions into clear, dynamic roadmaps that speak to investors and operators alike.",
};

export default function FinancialModellingPage() {
    return (
        <FinancialModellingSection />
    );
}