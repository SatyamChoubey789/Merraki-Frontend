"use client";

import { Suspense } from "react";
import PdfReportHeader from "@/components/pdf/PdfReportHeader";
import PdfReportFooter from "@/components/pdf/PdfReportFooter";
import { usePdfPreviewData } from "@/lib/hooks/usePdfPreviewData";
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

const ACCENT = "#B45309";
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

interface ForecastRow {
  month: number;
  revenue: number;
  burn: number;
  net: number;
  cashBalance: number;
}
interface RunwayResult {
  netBurn: number;
  runway: number | null;
  exhausted: number | null;
  forecast: ForecastRow[];
}

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function Metric({
  label,
  value,
  sub,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  const color = warn ? "#DC2626" : highlight ? ACCENT : "#0A0A0F";
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
          color,
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: SANS,
            fontSize: 10,
            color: warn ? "#DC2626" : "#9898AE",
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function RunwayPreviewInner() {
  const result = usePdfPreviewData<RunwayResult>();
  if (!result)
    return (
      <div style={{ padding: 40, fontFamily: SANS, color: "#9898AE" }}>
        Loading…
      </div>
    );

  const total = result.forecast.length;
  // Max 6 ticks to avoid crowding on 36-month axis
  const interval = Math.max(1, Math.ceil(total / 6) - 1);
  const AX = { fill: "#9898AE", fontSize: 10, fontFamily: MONO };
  const isLowRunway = result.exhausted !== null && result.exhausted < 12;

  // Table: first 6 months + every 3rd after
  const tableRows = result.forecast.filter((_, i) => i < 6 || i % 3 === 0);

  return (
    <div
      style={{
        padding: "28px 32px",
        fontFamily: SANS,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <PdfReportHeader calculatorName="Runway Calculator" accent={ACCENT} />

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Metric
          label="Runway"
          value={result.runway === null ? "Cash +ve" : `${result.runway} mo`}
          sub={
            result.exhausted
              ? `Cash depleted: Month ${result.exhausted}`
              : "No depletion in forecast"
          }
          highlight
          warn={isLowRunway}
        />
        <Metric label="Net Burn / Mo" value={fmtINR(result.netBurn)} />
        <Metric
          label="Cash Depleted"
          value={result.exhausted ? `Month ${result.exhausted}` : "Never"}
          warn={isLowRunway}
        />
        <Metric label="Forecast Months" value={`${total} mo`} />
      </div>

      {/* Chart 1 — Cash Balance full width */}
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
          Cash Balance Over Time
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={result.forecast}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="month"
              tickFormatter={(v) => `M${v}`}
              tick={AX}
              tickLine={false}
              axisLine={false}
              interval={interval}
            />
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
            <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
            {result.exhausted && (
              <ReferenceLine
                x={result.exhausted}
                stroke="#DC2626"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: `M${result.exhausted}`,
                  fill: "#DC2626",
                  fontSize: 10,
                  fontFamily: MONO,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cashBalance"
              name="Cash Balance"
              stroke={ACCENT}
              strokeWidth={2.5}
              fill="url(#cashGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2 — Revenue vs Burn full width */}
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
          Revenue vs Burn Rate
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
              tickLine={false}
              axisLine={false}
              interval={interval}
            />
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
              dataKey="revenue"
              name="Revenue"
              fill={`${ACCENT}20`}
              radius={[2, 2, 0, 0]}
              barSize={8}
            />
            <Line
              type="monotone"
              dataKey="burn"
              name="Burn Rate"
              stroke="#DC2626"
              strokeWidth={2.5}
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
          Runway Forecast (Key Months)
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
              {["Month", "Revenue", "Burn", "Net", "Cash Balance"].map((c) => (
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
            {tableRows.map((r) => (
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
                <td style={{ padding: "9px 12px" }}>{fmtINR(r.revenue)}</td>
                <td style={{ padding: "9px 12px", color: "#DC2626" }}>
                  {fmtINR(r.burn)}
                </td>
                <td
                  style={{
                    padding: "9px 12px",
                    color: r.net >= 0 ? "#16A34A" : "#DC2626",
                    fontWeight: 700,
                  }}
                >
                  {fmtINR(r.net)}
                </td>
                <td style={{ padding: "9px 12px", fontWeight: 700 }}>
                  {fmtINR(r.cashBalance)}
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

export default function RunwayPreviewPage() {
  return (
    <Suspense>
      <RunwayPreviewInner />
    </Suspense>
  );
}
