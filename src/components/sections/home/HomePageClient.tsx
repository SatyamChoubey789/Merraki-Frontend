"use client";

import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { ServicesSection } from "./ServicesSection";
import { FeaturedTemplates } from "./FeaturedTemplates";
import { FounderTestCTA } from "./FounderTestCTA";
import { FeaturedBlog } from "./FeaturedBlog";
import { FoundersSection } from "./FoundersSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FinalCTA } from "./FinalCTA";

export function HomePageClient() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturedTemplates />
      <FounderTestCTA />
      <FeaturedBlog />
      <FoundersSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
