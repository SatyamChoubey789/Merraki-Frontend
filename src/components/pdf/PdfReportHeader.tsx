"use client";

import { useSearchParams } from "next/navigation";

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

function LogoMark({ accent }: { accent: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 20V14" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 20V10" stroke={accent} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15 20V6" stroke={accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      <path d="M3 11L10 5L15 8L21 3" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 3H21V7.5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PdfReportHeaderProps {
  calculatorName: string;
  accent?: string;
}

export default function PdfReportHeader({
  calculatorName,
  accent = "#3B7BF6",
}: PdfReportHeaderProps) {
  const params = useSearchParams();
  const company = params.get("company") ?? "—";
  const tsRaw = params.get("ts");

  const formatted = (() => {
    const d = tsRaw ? new Date(Number(tsRaw)) : new Date();
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  })();

  return (
    <div style={{ width: "100%", fontFamily: SANS, position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "right", fontSize: 11, color: "#B7B7C9", marginBottom: 10 }}>
        {formatted}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1.5px solid #ECECF2",
          paddingBottom: 16,
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark accent={accent} />
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: accent,
              letterSpacing: "-0.02em",
            }}
          >
            {calculatorName}
          </span>
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#3A3A52" }}>
          {company}
        </div>
      </div>
    </div>
  );
}