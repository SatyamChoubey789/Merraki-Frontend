"use client";

import { Suspense } from "react";
import PdfReportHeader from "@/components/pdf/PdfReportHeader";
import PdfReportFooter from "@/components/pdf/PdfReportFooter";
import { usePdfPreviewData } from "@/lib/hooks/usePdfPreviewData";
import {
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ACCENT = "#7C3AED";
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

interface ForecastRow {
  year: string;
  revenue: number;
  ebitda: number;
  pv: number;
  marginPct: number;
}
interface ValuationResult {
  dcf: number;
  comp: number;
  blended: number;
  tvPV: number;
  forecast: ForecastRow[];
}

function fmtV(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
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

function ValuationPreviewInner() {
  const result = usePdfPreviewData<ValuationResult>();
  if (!result)
    return (
      <div style={{ padding: 40, fontFamily: SANS, color: "#9898AE" }}>
        Loading…
      </div>
    );

  const AX = { fill: "#9898AE", fontSize: 10, fontFamily: MONO };
  const total = result.forecast.length;
  const interval = Math.max(0, Math.ceil(total / 8) - 1);

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
        calculatorName="Valuation & Revenue Forecast Calculator"
        accent={ACCENT}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Metric label="DCF Valuation" value={fmtV(result.dcf)} highlight />
        <Metric label="Comparable" value={fmtV(result.comp)} />
        <Metric label="Blended" value={fmtV(result.blended)} />
        <Metric label="Terminal Value (PV)" value={fmtV(result.tvPV)} />
      </div>

      {/* Chart 1 — full width */}
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
          Revenue &amp; Profit
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart
            data={result.forecast}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={AX}
              tickLine={false}
              axisLine={false}
              interval={interval}
            />
            <YAxis
              tickFormatter={fmtV}
              tick={AX}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill={`${ACCENT}20`}
              radius={[3, 3, 0, 0]}
              barSize={28}
            />
            <Line
              type="monotone"
              dataKey="ebitda"
              name="Profit"
              stroke={ACCENT}
              strokeWidth={2.5}
              dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 — full width */}
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
          Present Value of Cash Flows
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={result.forecast}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACCENT} stopOpacity={0.14} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={AX}
              tickLine={false}
              axisLine={false}
              interval={interval}
            />
            <YAxis
              tickFormatter={fmtV}
              tick={AX}
              tickLine={false}
              axisLine={false}
              width={64}
            />
            <Area
              type="monotone"
              dataKey="pv"
              name="Present Value"
              stroke={ACCENT}
              strokeWidth={2.5}
              fill="url(#pvGrad)"
              dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
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
          Revenue Forecast Table
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
              {["Year", "Revenue", "Profit", "Margin", "Present Value"].map(
                (c) => (
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {result.forecast.map((r) => (
              <tr key={r.year} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td
                  style={{
                    padding: "9px 12px",
                    fontFamily: SANS,
                    color: "#3A3A52",
                  }}
                >
                  {r.year}
                </td>
                <td style={{ padding: "9px 12px" }}>{fmtV(r.revenue)}</td>
                <td style={{ padding: "9px 12px" }}>{fmtV(r.ebitda)}</td>
                <td style={{ padding: "9px 12px" }}>{r.marginPct}%</td>
                <td style={{ padding: "9px 12px" }}>{fmtV(r.pv)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PdfReportFooter />
    </div>
  );
}

export default function ValuationPreviewPage() {
  return (
    <Suspense>
      <ValuationPreviewInner />
    </Suspense>
  );
}
