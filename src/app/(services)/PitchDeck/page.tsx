import PitchDeckSection from "@/components/sections/services/PitchDeck";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pitch Deck Design Services | Merraki",
  description: "Craft a compelling story with Merraki's Pitch Deck Design services. We create visually stunning, investor-focused pitch decks that balance data and storytelling to help you secure funding.",
};

export default function PitchDeckPage() {
  return <PitchDeckSection />;
}