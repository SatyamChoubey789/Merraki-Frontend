"use client";

import StatsSection from "./StatsSection";
import ServicesSection from "./ServicesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FinalCTA } from "./FinalCTA";
import { HeroSection } from "./HeroSection";
import { BookConsultationClient } from "../consultation/BookConsultationClient";

export function HomePageClient() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BookConsultationClient />
      <StatsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
