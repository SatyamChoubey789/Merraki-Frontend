"use client";

import { Suspense } from "react";
import PdfReportHeader from "@/components/pdf/PdfReportHeader";
import PdfReportFooter from "@/components/pdf/PdfReportFooter";
import { usePdfPreviewData } from "@/lib/hooks/usePdfPreviewData";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ACCENT = "#0D7A5F";
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const AX = { fill: "#9898AE", fontSize: 10, fontFamily: MONO };

interface WaterfallEntry {
  name: string;
  value: number;
  color: string;
}
interface MarginEntry {
  name: string;
  margin: number;
}
interface MarginsResult {
  gross: number;
  gm: number;
  opProfit: number;
  om: number;
  net: number;
  nm: number;
  taxAmt: number;
  waterfall: WaterfallEntry[];
  margins: MarginEntry[];
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  interest: number;
  tax: number;
}

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
function pct(n: number, total: number) {
  return total > 0 ? `${((n / total) * 100).toFixed(1)}%` : "0.0%";
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: "16px 18px",
        borderRadius: 10,
        background: highlight ? `${ACCENT}0D` : "#F5F7FB",
        border: `1.5px solid ${highlight ? ACCENT + "33" : "#E5E7EB"}`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 3,
          borderRadius: 2,
          background: highlight ? ACCENT : "#D1D5DB",
          marginBottom: 10,
        }}
      />
      <div
        style={{
          fontFamily: SANS,
          fontSize: 11,
          fontWeight: 500,
          color: "#9898AE",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 18,
          color: highlight ? ACCENT : "#0A0A0F",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MarginsPreviewInner() {
  const result = usePdfPreviewData<MarginsResult>();
  if (!result)
    return (
      <div style={{ padding: 40, fontFamily: SANS, color: "#9898AE" }}>
        Loading…
      </div>
    );

  const rev = result.revenue ?? 0;
  const plRows: [string, string, string][] = [
    ["Revenue", fmtINR(rev), "100.0%"],
    [
      "Cost of Goods Sold",
      fmtINR(result.cogs ?? 0),
      pct(result.cogs ?? 0, rev),
    ],
    ["Gross Profit", fmtINR(result.gross), `${result.gm.toFixed(1)}%`],
    [
      "Operating Expenses",
      fmtINR(result.operatingExpenses ?? 0),
      pct(result.operatingExpenses ?? 0, rev),
    ],
    ["EBIT", fmtINR(result.opProfit), `${result.om.toFixed(1)}%`],
    ["Interest", fmtINR(result.interest ?? 0), "—"],
    ["Tax", fmtINR(result.taxAmt), `${result.tax ?? 0}%`],
    ["Net Profit", fmtINR(result.net), `${result.nm.toFixed(1)}%`],
  ];

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: SANS,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <PdfReportHeader
        calculatorName="Profit Margin Calculator"
        accent={ACCENT}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Metric
          label="Gross Margin"
          value={`${result.gm.toFixed(1)}%`}
          highlight
        />
        <Metric label="Operating Margin" value={`${result.om.toFixed(1)}%`} />
        <Metric label="Net Margin" value={`${result.nm.toFixed(1)}%`} />
        <Metric label="Tax Paid" value={fmtINR(result.taxAmt)} />
      </div>

      {/* Chart 1 — P&L Waterfall full width */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13,
            color: "#3A3A52",
            marginBottom: 10,
          }}
        >
          P&amp;L Waterfall
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={result.waterfall}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis dataKey="name" tick={AX} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) =>
                v >= 1e6
                  ? `₹${(v / 1e6).toFixed(1)}M`
                  : `₹${(v / 1000).toFixed(0)}K`
              }
              tick={AX}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Bar
              dataKey="value"
              name="Amount"
              radius={[3, 3, 0, 0]}
              barSize={40}
              fill={`${ACCENT}28`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 — Margin Comparison full width */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13,
            color: "#3A3A52",
            marginBottom: 10,
          }}
        >
          Margin Comparison
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart
            data={result.margins}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis dataKey="name" tick={AX} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={AX}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Bar
              dataKey="margin"
              name="Margin %"
              fill={`${ACCENT}22`}
              radius={[3, 3, 0, 0]}
              barSize={60}
            />
            <Line
              type="monotone"
              dataKey="margin"
              stroke={ACCENT}
              strokeWidth={2.5}
              dot={{ fill: ACCENT, r: 5, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* P&L Table */}
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 14,
            color: "#0A0A0F",
            marginBottom: 10,
          }}
        >
          P&amp;L Summary
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #E5E7EB",
            fontSize: 12,
            fontFamily: MONO,
          }}
        >
          <thead>
            <tr style={{ background: "#F5F7FB" }}>
              {["Line Item", "Amount", "% of Revenue"].map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontFamily: SANS,
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#3A3A52",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plRows.map(([label, amount, share]) => {
              const isSubtotal = [
                "Gross Profit",
                "EBIT",
                "Net Profit",
              ].includes(label);
              const isNegContext = [
                "Cost of Goods Sold",
                "Operating Expenses",
                "Interest",
                "Tax",
              ].includes(label);
              return (
                <tr
                  key={label}
                  style={{
                    borderBottom: "1px solid #F3F4F6",
                    background: isSubtotal ? "#F0FDF4" : undefined,
                  }}
                >
                  <td
                    style={{
                      padding: "9px 12px",
                      fontFamily: SANS,
                      color: "#3A3A52",
                      fontWeight: isSubtotal ? 700 : 400,
                    }}
                  >
                    {label}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      color: isNegContext
                        ? "#DC2626"
                        : isSubtotal
                          ? "#16A34A"
                          : "#0A0A0F",
                      fontWeight: isSubtotal ? 700 : 600,
                    }}
                  >
                    {amount}
                  </td>
                  <td style={{ padding: "9px 12px", color: "#6B7280" }}>
                    {share}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PdfReportFooter />
    </div>
  );
}

export default function MarginsPreviewPage() {
  return (
    <Suspense>
      <MarginsPreviewInner />
    </Suspense>
  );
}
