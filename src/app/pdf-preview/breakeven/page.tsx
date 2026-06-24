"use client";

import { useEffect, useState } from "react";
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
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { PDFData, ForecastRow } from "@/types/pdf";
import "../print.css";

// ── Extend Window for Puppeteer injection ──────────────────
declare global {
  interface Window {
    __PDF_DATA__?: PDFData;
  }
}

const ACCENT = "#3B7BF6";

const AX = {
  fontSize: 7,
  fill: "#9CA3AF",
  fontFamily: "Inter, sans-serif",
} as const;

// ── Formatters ─────────────────────────────────────────────
function fmtINR(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "∞";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function fmtAxis(v: number): string {
  if (v >= 1_000_000) return `₹${(v / 1_000_000).toFixed(1)}M`;
  return `₹${(v / 1_000).toFixed(0)}K`;
}

// ── Component ──────────────────────────────────────────────
export default function BreakevenPDFPreview() {
  const [data, setData] = useState<PDFData | null>(null);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const raw = window.__PDF_DATA__;
      if (raw) {
        setData(raw);
        clearInterval(interval);
        return;
      }
      attempts++;
      if (attempts > 50) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div
        style={{ padding: 40, fontFamily: "Inter, sans-serif", color: "#6B7280" }}
      >
        Loading...
      </div>
    );
  }

  const { result, companyName } = data;

  const tickInterval =
    result.forecast.length > 0
      ? Math.max(1, Math.floor(result.forecast.length / 6))
      : 1;

  const tooltipFormatter = (v?: ValueType) => {
    if (v == null) return "—";
    return fmtINR(Number(v as number));
  };

  return (
    <div className="pdf-page">

      {/* ── HEADER ── */}
      <div className="pdf-header">
        <div className="pdf-header-title" style={{ color: ACCENT }}>
          Break-Even Calculator
        </div>
        <div className="pdf-header-right">
          <div className="pdf-header-date">{formatDate()}</div>
          <div className="pdf-header-company">{companyName}</div>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="pdf-metrics">
        <div
          className="pdf-metric-card"
          style={{ background: "#F0F4FF", borderColor: `${ACCENT}40` }}
        >
          <div className="pdf-metric-label">Breakeven Month</div>
          <div className="pdf-metric-value" style={{ color: ACCENT }}>
            {result.bem != null ? `Month ${result.bem}` : "—"}
          </div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Breakeven Units</div>
          <div className="pdf-metric-value">
            {result.beu != null
              ? result.beu.toLocaleString("en-IN")
              : "—"}
          </div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Breakeven Revenue</div>
          <div className="pdf-metric-value">{fmtINR(result.ber)}</div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Contribution Margin</div>
          <div className="pdf-metric-value">{result.cm.toFixed(1)}%</div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="pdf-charts">

        {/* Cumulative Profit / Loss */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Cumulative Profit / Loss</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={result.forecast}>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(v: number) => `M${v}`}
                tick={AX}
                axisLine={false}
                tickLine={false}
                interval={tickInterval}
              />
              <YAxis
                tickFormatter={fmtAxis}
                tick={AX}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip formatter={tooltipFormatter} />
              <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
              {result.bem != null && (
                <ReferenceLine
                  x={result.bem}
                  stroke={ACCENT}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `M${result.bem}`,
                    fill: ACCENT,
                    fontSize: 9,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="cumulativeProfit"
                stroke={ACCENT}
                strokeWidth={2}
                fill={`${ACCENT}22`}
                dot={false}
                activeDot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Fixed Costs */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Revenue vs Fixed Costs</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={result.forecast}>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(v: number) => `M${v}`}
                tick={AX}
                axisLine={false}
                tickLine={false}
                interval={tickInterval}
              />
              <YAxis
                tickFormatter={fmtAxis}
                tick={AX}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar
                dataKey="revenue"
                fill={`${ACCENT}22`}
                barSize={6}
                radius={[2, 2, 0, 0]}
              />
              <Line
                dataKey="fixedCost"
                stroke="#DC2626"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── TABLE ── */}
      <div className="pdf-table-title">Monthly Forecast</div>
      <table className="pdf-table">
        <thead>
          <tr>
            {[
              "Month",
              "Units",
              "Revenue",
              "Var. Costs",
              "Fixed Costs",
              "Profit",
              "Cumulative",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.forecast.map((r: ForecastRow) => (
            <tr key={r.month}>
              <td>Month {r.month}</td>
              <td>{r.units.toLocaleString("en-IN")}</td>
              <td>{fmtINR(r.revenue)}</td>
              <td>{fmtINR(r.varCost)}</td>
              <td>{fmtINR(r.fixedCost)}</td>
              <td>{fmtINR(r.profit)}</td>
              <td>{fmtINR(r.cumulativeProfit)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── FOOTER ── */}
      <div className="pdf-footer">
        <div className="pdf-footer-site">www.merrakisolutions.com</div>
        <div className="pdf-footer-disclaimer">
          This report is auto generated – based on provided assumptions.
        </div>
      </div>

    </div>
  );
}