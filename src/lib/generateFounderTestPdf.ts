// lib/generateFounderTestPdf.ts
"use client";

import { jsPDF } from "jspdf";
import type { TestResult } from "@/lib/hooks/useFounderTestEngine";

interface ContactInfo {
  name: string;
  email: string;
  company?: string;
  role?: string;
}

/* ── Palette (mirrors the on-screen theme) ───────────────── */
const C = {
  darkBg: "#0D1B2E",
  ink: "#0A0A0F",
  inkMid: "#1E293B",
  inkMuted: "#5A6478",
  inkFaint: "#A0A0AE",
  white: "#FFFFFF",
  border: "#E4E4EA",
  purple: "#7C3AED",
  pink: "#EC4899",
  indigo: "#818CF8",
  green: "#059669",
  red: "#DC2626",
  amber: "#D97706",
};

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function barColor(pct: number) {
  if (pct < 50) return C.red;
  if (pct < 70) return C.amber;
  return C.green;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Generates and triggers a download of the Founder Financial DNA Test
 * results as a polished, self-contained PDF — no server round-trip.
 */
export function generateFounderTestPdf(
  result: TestResult,
  contact: ContactInfo | null,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 0;

  /* ── Header band ─────────────────────────────── */
  doc.setFillColor(...hexToRgb(C.darkBg));
  doc.rect(0, 0, PAGE_W, 52, "F");

  doc.setTextColor(...hexToRgb("#A5B4FC"));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("FOUNDER FINANCIAL DNA — RESULTS", MARGIN, 16);

  doc.setTextColor(...hexToRgb(C.white));
  doc.setFontSize(20);
  doc.text(result.personalityTitle, MARGIN, 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const descLines = doc.splitTextToSize(
    result.personalityDescription,
    CONTENT_W - 50,
  );
  doc.setTextColor(...hexToRgb("#C7CBDA"));
  doc.text(descLines, MARGIN, 36);

  // Score badge, top right
  doc.setFillColor(...hexToRgb(C.purple));
  doc.roundedRect(PAGE_W - MARGIN - 38, 14, 38, 16, 2, 2, "F");
  doc.setTextColor(...hexToRgb(C.white));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    `${result.totalScore}/${result.totalMax}`,
    PAGE_W - MARGIN - 19,
    23,
    {
      align: "center",
    },
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("OVERALL SCORE", PAGE_W - MARGIN - 19, 27.5, { align: "center" });

  y = 62;

  if (contact?.name) {
    doc.setTextColor(...hexToRgb(C.inkFaint));
    doc.setFontSize(8);
    doc.text(
      `Prepared for ${contact.name}${contact.company ? " · " + contact.company : ""}`,
      MARGIN,
      y,
    );
    y += 7;
  }

  /* ── Message ─────────────────────────────────── */
  doc.setDrawColor(...hexToRgb(C.border));
  doc.setFillColor(248, 248, 250);
  const msgLines = doc.splitTextToSize(result.message, CONTENT_W - 8);
  const msgH = msgLines.length * 4.6 + 8;
  doc.roundedRect(MARGIN, y, CONTENT_W, msgH, 2, 2, "FD");
  doc.setTextColor(...hexToRgb(C.inkMid));
  doc.setFontSize(9.5);
  doc.text(msgLines, MARGIN + 4, y + 7);
  y += msgH + 10;

  /* ── Section scores ──────────────────────────── */
  doc.setTextColor(...hexToRgb(C.ink));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Section Scores", MARGIN, y);
  y += 7;

  result.scores.forEach((s) => {
    const color = barColor(s.percentage);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(C.inkMid));
    doc.text(s.label, MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...hexToRgb(color));
    doc.text(`${s.percentage}%`, MARGIN + CONTENT_W, y, { align: "right" });

    y += 2.2;
    doc.setFillColor(...hexToRgb("#EEEEF2"));
    doc.roundedRect(MARGIN, y, CONTENT_W, 2.6, 1.3, 1.3, "F");
    doc.setFillColor(...hexToRgb(color));
    const w = Math.max((CONTENT_W * s.percentage) / 100, 2.6);
    doc.roundedRect(MARGIN, y, w, 2.6, 1.3, 1.3, "F");
    y += 7.5;
  });

  y += 4;

  /* ── Two-column: Strengths | Risk areas ─────────*/
  const colW = (CONTENT_W - 8) / 2;
  const col2X = MARGIN + colW + 8;
  const startY = y;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(C.green));
  doc.text("What you're doing right", MARGIN, y);
  let yL = y + 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...hexToRgb(C.inkMid));
  result.strengths.forEach((s) => {
    const lines = doc.splitTextToSize(`• ${s}`, colW);
    doc.text(lines, MARGIN, yL);
    yL += lines.length * 4.2 + 2;
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...hexToRgb(C.red));
  doc.text("Where you're losing ground", col2X, startY);
  let yR = startY + 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...hexToRgb(C.inkMid));
  result.riskAreas.forEach((r) => {
    const lines = doc.splitTextToSize(`• ${r}`, colW);
    doc.text(lines, col2X, yR);
    yR += lines.length * 4.2 + 2;
  });

  y = Math.max(yL, yR) + 8;

  /* ── Page break if needed ────────────────────── */
  if (y > PAGE_H - 70) {
    doc.addPage();
    y = MARGIN;
  }

  /* ── Immediate actions ───────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...hexToRgb(C.ink));
  doc.text("Immediate Actions", MARGIN, y);
  y += 7;

  result.growthSuggestions.forEach((s, i) => {
    if (y > PAGE_H - 25) {
      doc.addPage();
      y = MARGIN;
    }
    doc.setFillColor(...hexToRgb(C.indigo));
    doc.circle(MARGIN + 2.5, y - 1.3, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...hexToRgb(C.white));
    doc.text(String(i + 1), MARGIN + 2.5, y - 0.3, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...hexToRgb(C.inkMid));
    const lines = doc.splitTextToSize(s, CONTENT_W - 10);
    doc.text(lines, MARGIN + 8, y);
    y += lines.length * 4.4 + 3;
  });

  /* ── Footer / CTA on last page ───────────────── */
  const footY = PAGE_H - 22;
  doc.setDrawColor(...hexToRgb(C.border));
  doc.line(MARGIN, footY, PAGE_W - MARGIN, footY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...hexToRgb(C.inkFaint));
  doc.text(
    "Generated by Merraki — Founder Financial DNA Test",
    MARGIN,
    footY + 6,
  );
  doc.text(
    new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    PAGE_W - MARGIN,
    footY + 6,
    { align: "right" },
  );

  const fileSafeName = (contact?.name || "founder")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  doc.save(`financial-dna-report-${fileSafeName}.pdf`);
}
