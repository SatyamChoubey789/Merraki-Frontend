"use client";

import { Suspense } from "react";
import PdfReportHeader from "@/components/pdf/PdfReportHeader";
import PdfReportFooter from "@/components/pdf/PdfReportFooter";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { usePdfPreviewData } from "@/lib/hooks/usePdfPreviewData";

const ACCENT = "#3B7BF6";
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

interface ForecastRow {
  month: number;
  units: number;
  revenue: number;
  varCost: number;
  fixedCost: number;
  profit: number;
  cumulativeProfit: number;
}
interface BreakevenResult {
  contrib: number;
  cm: number;
  beu: number | null;
  ber: number | null;
  bem: number | null;
  forecast: ForecastRow[];
}

function fmtINR(n: number | null) {
  if (n === null || !isFinite(n)) return "∞";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtNum(n: number | null) {
  return n === null ? "∞" : n.toLocaleString("en-IN");
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

function BreakevenPreviewInner() {
  const result = usePdfPreviewData<BreakevenResult>();
  if (!result)
    return (
      <div style={{ padding: 40, fontFamily: SANS, color: "#9898AE" }}>
        Loading…
      </div>
    );

  const total = result.forecast.length;
  // Show max 8 ticks on x-axis to prevent overlap
  const interval = Math.max(1, Math.ceil(total / 8) - 1);
  const AX = { fill: "#9898AE", fontSize: 10, fontFamily: MONO };

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: SANS,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <PdfReportHeader calculatorName="Break-Even Calculator" accent={ACCENT} />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Metric
          label="Breakeven Month"
          value={result.bem ? `Month ${result.bem}` : "—"}
          highlight
        />
        <Metric label="Breakeven Units" value={fmtNum(result.beu)} />
        <Metric label="Breakeven Revenue" value={fmtINR(result.ber)} />
        <Metric
          label="Contribution Margin"
          value={`${result.cm.toFixed(1)}%`}
        />
      </div>

      {/* Charts — full width each, stacked, not side by side — prevents overflow */}
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
          Cumulative Profit / Loss
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={result.forecast}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(v) => `M${v}`}
              tick={AX}
              axisLine={false}
              tickLine={false}
              interval={interval}
            />
            <YAxis
              tickFormatter={(v) =>
                v >= 1e6
                  ? `₹${(v / 1e6).toFixed(1)}M`
                  : `₹${(v / 1e3).toFixed(0)}K`
              }
              tick={AX}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
            {result.bem && (
              <ReferenceLine
                x={result.bem}
                stroke={ACCENT}
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `M${result.bem}`,
                  fill: ACCENT,
                  fontSize: 10,
                  fontFamily: MONO,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulativeProfit"
              stroke={ACCENT}
              strokeWidth={2.5}
              fill={`${ACCENT}20`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

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
          Revenue vs Fixed Costs
        </div>
        <ResponsiveContainer width="100%" height={200}>
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
              dataKey="month"
              tickFormatter={(v) => `M${v}`}
              tick={AX}
              axisLine={false}
              tickLine={false}
              interval={interval}
            />
            <YAxis
              tickFormatter={(v) =>
                v >= 1e6
                  ? `₹${(v / 1e6).toFixed(1)}M`
                  : `₹${(v / 1e3).toFixed(0)}K`
              }
              tick={AX}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Bar
              dataKey="revenue"
              fill={`${ACCENT}22`}
              barSize={8}
              radius={[2, 2, 0, 0]}
            />
            <Line
              dataKey="fixedCost"
              stroke="#DC2626"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
            />
          </ComposedChart>
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
          Monthly Forecast
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
              {[
                "Month",
                "Units",
                "Revenue",
                "Var. Costs",
                "Fixed Costs",
                "Profit",
                "Cumulative",
              ].map((c) => (
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
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.forecast.map((r) => (
              <tr key={r.month} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td
                  style={{
                    padding: "9px 12px",
                    fontFamily: SANS,
                    color: "#3A3A52",
                  }}
                >
                  Month {r.month}
                </td>
                <td style={{ padding: "9px 12px" }}>{fmtNum(r.units)}</td>
                <td style={{ padding: "9px 12px" }}>{fmtINR(r.revenue)}</td>
                <td style={{ padding: "9px 12px" }}>{fmtINR(r.varCost)}</td>
                <td style={{ padding: "9px 12px" }}>{fmtINR(r.fixedCost)}</td>
                <td
                  style={{
                    padding: "9px 12px",
                    color: r.profit >= 0 ? "#16A34A" : "#DC2626",
                    fontWeight: 700,
                  }}
                >
                  {fmtINR(r.profit)}
                </td>
                <td
                  style={{
                    padding: "9px 12px",
                    color: r.cumulativeProfit >= 0 ? "#16A34A" : "#DC2626",
                    fontWeight: 700,
                  }}
                >
                  {fmtINR(r.cumulativeProfit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PdfReportFooter />
    </div>
  );
}

export default function BreakevenPreviewPage() {
  return (
    <Suspense>
      <BreakevenPreviewInner />
    </Suspense>
  );
}
