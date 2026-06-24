import type { Metadata } from "next";
import { VirtualCFO } from "@/components/sections/services/VirtualCFO";

export const metadata: Metadata = {
  title: "Virtual CFO Services | Merraki",
  description: "Get expert financial guidance with Merraki's Virtual CFO services. We provide comprehensive support for startup founders to navigate financial challenges and drive growth.",
};

export default function Page() {
  return <VirtualCFO />;
}   