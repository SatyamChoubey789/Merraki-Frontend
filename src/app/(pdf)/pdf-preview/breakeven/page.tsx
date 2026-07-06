/**
 * app/pdf-preview/breakeven/page.tsx
 *
 * Puppeteer capture target for the Break-Even Calculator PDF.
 * URL: /pdf-preview/breakeven?company=…&ts=…&data=<base64-result>
 */

"use client";

import { Suspense } from "react";
import PdfReportHeader from "@/components/pdf/PdfReportHeader";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { usePdfPreviewData } from "@/lib/hooks/usePdfPreviewData";

const ACCENT = "#3B7BF6";
const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO = '"DM Mono","JetBrains Mono",ui-monospace,monospace';

// ── Types (mirror your compute() return) ───────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────
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

// ── Metric pill ────────────────────────────────────────────────────────────
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
        padding: "14px 16px",
        borderRadius: 10,
        background: highlight ? `${ACCENT}0D` : "#F5F7FB",
        border: `1.5px solid ${highlight ? ACCENT + "33" : "#E5E7EB"}`,
      }}
    >
      <div
        style={{
          width: 20,
          height: 2.5,
          borderRadius: 2,
          background: highlight ? ACCENT : "#D1D5DB",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          fontFamily: SANS,
          fontSize: 10,
          fontWeight: 500,
          color: "#9898AE",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 16,
          color: highlight ? ACCENT : "#0A0A0F",
          letterSpacing: "-0.025em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
function ForecastTable({ rows }: { rows: ForecastRow[] }) {
  const cols = [
    "Month",
    "Units",
    "Revenue",
    "Var. Costs",
    "Fixed Costs",
    "Profit",
    "Cumulative",
  ];
  return (
    <div style={{ marginTop: 24 }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 12,
          color: "#0A0A0F",
          marginBottom: 8,
        }}
      >
        Monthly Forecast
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          overflow: "hidden",
          fontSize: 10,
          fontFamily: MONO,
        }}
      >
        <thead>
          <tr style={{ background: "#F5F7FB" }}>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  padding: "8px 10px",
                  textAlign: "left",
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 9,
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
          {rows.map((r) => (
            <tr
              key={r.month}
              style={{ borderBottom: "1px solid #F3F4F6" }}
            >
              <td style={{ padding: "7px 10px", fontFamily: SANS, color: "#3A3A52" }}>
                Month {r.month}
              </td>
              <td style={{ padding: "7px 10px" }}>{fmtNum(r.units)}</td>
              <td style={{ padding: "7px 10px" }}>{fmtINR(r.revenue)}</td>
              <td style={{ padding: "7px 10px" }}>{fmtINR(r.varCost)}</td>
              <td style={{ padding: "7px 10px" }}>{fmtINR(r.fixedCost)}</td>
              <td
                style={{
                  padding: "7px 10px",
                  color: r.profit >= 0 ? "#16A34A" : "#DC2626",
                  fontWeight: 700,
                }}
              >
                {fmtINR(r.profit)}
              </td>
              <td
                style={{
                  padding: "7px 10px",
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
  );
}

// ── Preview page (inner — needs Suspense boundary for useSearchParams) ─────
function BreakevenPreviewInner() {
  const result = usePdfPreviewData<BreakevenResult>();
  const interval = result ? Math.max(1, Math.floor(result.forecast.length / 6)) : 1;

  if (!result) {
    return (
      <div style={{ padding: 40, fontFamily: SANS, color: "#9898AE" }}>
        Loading…
      </div>
    );
  }

  const AX = { fill: "#9898AE", fontSize: 8, fontFamily: MONO };

  return (
    <div
      style={{
        padding: "32px 36px",
        fontFamily: SANS,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <PdfReportHeader
        calculatorName="Break-Even Calculator"
        accent={ACCENT}
      />

      {/* Metrics row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <Metric
          label="Breakeven Month"
          value={result.bem ? `Month ${result.bem}` : "—"}
          highlight
        />
        <Metric
          label="Breakeven Units"
          value={fmtNum(result.beu)}
        />
        <Metric
          label="Breakeven Revenue"
          value={fmtINR(result.ber)}
        />
        <Metric
          label="Contribution Margin"
          value={`${result.cm.toFixed(1)}%`}
        />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: 20, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 11,
              color: "#3A3A52",
              marginBottom: 10,
            }}
          >
            Cumulative Profit / Loss
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={result.forecast}>
              <CartesianGrid strokeDasharray="2 4" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} tick={AX} axisLine={false} tickLine={false} interval={interval} />
              <YAxis tickFormatter={(v) => v >= 1e6 ? `₹${(v / 1e6).toFixed(1)}M` : `₹${(v / 1e3).toFixed(0)}K`} tick={AX} axisLine={false} tickLine={false} width={52} />
              <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
              {result.bem && (
                <ReferenceLine x={result.bem} stroke={ACCENT} strokeDasharray="3 3" strokeWidth={1.5}
                  label={{ value: `M${result.bem}`, fill: ACCENT, fontSize: 8, fontFamily: MONO }} />
              )}
              <Area type="monotone" dataKey="cumulativeProfit" stroke={ACCENT} strokeWidth={2} fill={`${ACCENT}22`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 11,
              color: "#3A3A52",
              marginBottom: 10,
            }}
          >
            Revenue vs Fixed Costs
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={result.forecast}>
              <CartesianGrid strokeDasharray="2 4" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} tick={AX} axisLine={false} tickLine={false} interval={interval} />
              <YAxis tickFormatter={(v) => v >= 1e6 ? `₹${(v / 1e6).toFixed(1)}M` : `₹${(v / 1e3).toFixed(0)}K`} tick={AX} axisLine={false} tickLine={false} width={52} />
              <Bar dataKey="revenue" fill={`${ACCENT}22`} barSize={6} radius={[2, 2, 0, 0]} />
              <Line dataKey="fixedCost" stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ForecastTable rows={result.forecast} />

      {/* Footer */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 14,
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: SANS, fontSize: 9, color: "#9898AE" }}>
          Generated by merraki · merraki.in
        </span>
        <span style={{ fontFamily: SANS, fontSize: 9, color: "#9898AE" }}>
          This report is for informational purposes only.
        </span>
      </div>
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