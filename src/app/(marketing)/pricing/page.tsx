import PricingSection from "@/components/sections/pricing/PricingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Merraki",
  description:
    "Discover our transparent and flexible pricing plans designed to fit your financial needs. Choose the perfect plan for you and start your journey towards financial freedom with Merraki.",
};

export default function PricingPage() {
  return <PricingSection />;
}
