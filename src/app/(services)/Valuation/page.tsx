import ValuationSection from "@/components/sections/services/Valuation";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Valuation Services | Merraki",
  description: "Discover the true worth of your business with Merraki's Valuation services. We utilize DCF, comparable company analysis, and startup-stage valuation logic to provide you with accurate insights from an investor's perspective.",
};

export default function ValuationPage() {
  return <ValuationSection />;
}