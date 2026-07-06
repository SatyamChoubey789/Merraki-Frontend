/**
 * PdfReportHeader.tsx
 *
 * Rendered at the top of every /pdf-preview/* page during Puppeteer capture.
 * Reads `company` and `ts` from the URL search params injected by the API route.
 *
 * Usage in each preview page:
 *   import PdfReportHeader from "@/components/pdf/PdfReportHeader";
 *   ...
 *   <PdfReportHeader calculatorName="Break-Even Calculator" accent="#3B7BF6" />
 */

"use client";

import { useSearchParams } from "next/navigation";

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

// Calculator accent colours — keep in sync with each calc page
const ACCENT_FALLBACK = "#3B7BF6";

interface PdfReportHeaderProps {
  calculatorName: string;
  accent?: string;
}

export default function PdfReportHeader({
  calculatorName,
  accent = ACCENT_FALLBACK,
}: PdfReportHeaderProps) {
  const params = useSearchParams();
  const company = params.get("company") ?? "—";
  const tsRaw = params.get("ts");

  // Format timestamp: "24 Jun 2025, 14:32 IST"
  const formatted = (() => {
    const d = tsRaw ? new Date(Number(tsRaw)) : new Date();
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
      timeZoneName: "short",
    });
  })();

  return (
    <div
      style={{
        width: "100%",
        fontFamily: SANS,
        borderBottom: "1.5px solid #E5E7EB",
        marginBottom: 28,
        paddingBottom: 18,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      {/* Left: branding + calculator name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Accent bar */}
        <div
          style={{
            width: 3,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${accent} 0%, ${accent}55 100%)`,
            flexShrink: 0,
          }}
        />
        <div>
          {/* merraki wordmark */}
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: accent,
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            merraki
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 18,
              color: "#0A0A0F",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {calculatorName}
          </div>
        </div>
      </div>

      {/* Right: company + timestamp */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13,
            color: "#111827",
            marginBottom: 3,
          }}
        >
          {company}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: "#6B7280",
            letterSpacing: "0.01em",
          }}
        >
          Generated: {formatted}
        </div>
      </div>
    </div>
  );
}