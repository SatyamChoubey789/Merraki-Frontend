import type { Metadata } from "next";
import { HomePageClient } from "@/components/sections/home/HomePageClient";

export const metadata: Metadata = {
  title: "Merraki Solutions — Your Trusted Partner in Fiscal Fitness",
  description:
    "We simplify finance so businesses amplify growth. Financial modelling, Excel dashboards, templates, and founder consulting.",
};

export default function HomePage() {
  return <HomePageClient />;
}
