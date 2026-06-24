"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import "../print.css";

// ── Types ──────────────────────────────────────────────────
interface ValuationForecastRow {
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
  forecast: ValuationForecastRow[];
}

interface ValuationPDFData {
  result: ValuationResult;
  companyName: string;
}

// ── Constants ──────────────────────────────────────────────
const ACCENT = "#7C3AED";

const AX = {
  fontSize: 7,
  fill: "#9CA3AF",
  fontFamily: "Inter, sans-serif",
} as const;

// ── Formatters ─────────────────────────────────────────────
function fmtV(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function formatDate(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

// ── Component ──────────────────────────────────────────────
export default function ValuationPDFPreview() {
  const [data, setData] = useState<ValuationPDFData | null>(null);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      const raw = (window as Window & { __PDF_DATA__?: ValuationPDFData }).__PDF_DATA__;
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

  const tooltipFormatter = (v?: ValueType) => {
    if (v == null) return "—";
    return fmtV(Number(v));
  };

  return (
    <div className="pdf-page">

      {/* ── HEADER ── */}
      <div className="pdf-header">
        <div className="pdf-header-title" style={{ color: ACCENT }}>
          Valuation Calculator
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
          style={{ background: "#F5F3FF", borderColor: `${ACCENT}40` }}
        >
          <div className="pdf-metric-label">DCF Valuation</div>
          <div className="pdf-metric-value" style={{ color: ACCENT }}>
            {fmtV(result.dcf)}
          </div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Comparable</div>
          <div className="pdf-metric-value">{fmtV(result.comp)}</div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Blended</div>
          <div className="pdf-metric-value">{fmtV(result.blended)}</div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Terminal Value (PV)</div>
          <div className="pdf-metric-value">{fmtV(result.tvPV)}</div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="pdf-charts">

        {/* Revenue & Profit */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Revenue & Profit</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={result.forecast}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
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
              />
              <YAxis
                tickFormatter={fmtV}
                tick={AX}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={`${ACCENT}20`}
                radius={[2, 2, 0, 0]}
                barSize={22}
              />
              <Line
                type="monotone"
                dataKey="ebitda"
                name="Profit"
                stroke={ACCENT}
                strokeWidth={2}
                dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Present Value of Cash Flows */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Present Value of Cash Flows</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={result.forecast}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="pvGradPDF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.12} />
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
              />
              <YAxis
                tickFormatter={fmtV}
                tick={AX}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Area
                type="monotone"
                dataKey="pv"
                name="Present Value"
                stroke={ACCENT}
                strokeWidth={2}
                fill="url(#pvGradPDF)"
                dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ── TABLE ── */}
      <div className="pdf-table-title">Revenue Forecast Table</div>
      <table className="pdf-table">
        <thead>
          <tr>
            {["Year", "Revenue", "Profit", "Margin", "Present Value"].map(
              (h) => (
                <th key={h}>{h}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {result.forecast.map((r: ValuationForecastRow) => (
            <tr key={r.year}>
              <td>{r.year}</td>
              <td>{fmtV(r.revenue)}</td>
              <td>{fmtV(r.ebitda)}</td>
              <td>{r.marginPct}%</td>
              <td>{fmtV(r.pv)}</td>
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