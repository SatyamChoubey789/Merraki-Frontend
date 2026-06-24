"use client";

import FractionalCFOSection from "./FractionalCFOSection";
import QuickCheckSection from "./QuickCheckSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FinalCTA } from "./FinalCTA";
import { HeroSection } from "./HeroSection";
import ClaritySection from "./ClaritySection";
import { PricingSection } from "./PricingSection";
import GlobalTrustSection  from "./GlobalTrustSection";

export function HomePageClient() {
  return (
    <>
      <HeroSection />
      <ClaritySection />
      <QuickCheckSection />
      <FractionalCFOSection />
      <PricingSection />
      <GlobalTrustSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
