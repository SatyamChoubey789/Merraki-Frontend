"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";
import "../print.css";

// ── Types ──────────────────────────────────────────────────
interface WaterfallRow {
  name: string;
  value: number;
  color: string;
}

interface MarginRow {
  name: string;
  margin: number;
}

interface ProfitMarginResult {
  gross: number;
  gm: number;
  opProfit: number;
  om: number;
  net: number;
  nm: number;
  taxAmt: number;
  waterfall: WaterfallRow[];
  margins: MarginRow[];
}

interface ProfitMarginPDFData {
  result: ProfitMarginResult;
  companyName: string;
}

// ── Constants ──────────────────────────────────────────────
const ACCENT = "#0D7A5F";
const RED = "#DC2626";

const AX = {
  fontSize: 7,
  fill: "#9CA3AF",
  fontFamily: "Inter, sans-serif",
} as const;

// ── Formatters ─────────────────────────────────────────────
function fmtINR(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtAxis(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `₹${(v / 1_000_000).toFixed(1)}M`;
  return `₹${(v / 1_000).toFixed(0)}K`;
}

function formatDate(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

// ── Component ──────────────────────────────────────────────
export default function ProfitMarginPDFPreview() {
  const [data, setData] = useState<ProfitMarginPDFData | null>(null);

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
        style={{
          padding: 40,
          fontFamily: "Inter, sans-serif",
          color: "#6B7280",
        }}
      >
        Loading...
      </div>
    );
  }

  const { result, companyName } = data;

  // Rebuild table rows from result (same logic as the calculator)
  const revenue =
    result.waterfall.find((r) => r.name === "Revenue")?.value ?? 0;
  const cogs = Math.abs(
    result.waterfall.find((r) => r.name === "COGS")?.value ?? 0,
  );
  const opEx = Math.abs(
    result.waterfall.find((r) => r.name === "OpEx")?.value ?? 0,
  );
  const interest = Math.abs(
    result.waterfall.find((r) => r.name === "Interest")?.value ?? 0,
  );
  const taxAmt = result.taxAmt;

  const tableRows = [
    ["Revenue", fmtINR(revenue), "100.0%"],
    [
      "Cost of Goods Sold",
      fmtINR(cogs),
      revenue ? `${((cogs / revenue) * 100).toFixed(1)}%` : "0.0%",
    ],
    ["Gross Profit", fmtINR(result.gross), `${result.gm.toFixed(1)}%`],
    [
      "Operating Expenses",
      fmtINR(opEx),
      revenue ? `${((opEx / revenue) * 100).toFixed(1)}%` : "0.0%",
    ],
    ["EBIT", fmtINR(result.opProfit), `${result.om.toFixed(1)}%`],
    ["Interest", fmtINR(interest), "—"],
    ["Tax", fmtINR(taxAmt), "—"],
    ["Net Profit", fmtINR(result.net), `${result.nm.toFixed(1)}%`],
  ];

  const tooltipFormatter = (v?: ValueType) => {
    if (v == null) return "—";
    return fmtINR(Number(v));
  };

  return (
    <div className="pdf-page">
      {/* ── HEADER ── */}
      <div className="pdf-header">
        <div className="pdf-header-title" style={{ color: ACCENT }}>
          Profit Margin Calculator
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
          style={{ background: "#F0FDF9", borderColor: `${ACCENT}40` }}
        >
          <div className="pdf-metric-label">Gross Margin</div>
          <div className="pdf-metric-value" style={{ color: ACCENT }}>
            {result.gm.toFixed(1)}%
          </div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Operating Margin</div>
          <div className="pdf-metric-value">{result.om.toFixed(1)}%</div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Net Margin</div>
          <div className="pdf-metric-value">{result.nm.toFixed(1)}%</div>
        </div>

        <div className="pdf-metric-card">
          <div className="pdf-metric-label">Tax Paid</div>
          <div className="pdf-metric-value">{fmtINR(result.taxAmt)}</div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="pdf-charts">
        {/* P&L Waterfall */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">P&L Waterfall</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={result.waterfall}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={AX}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={fmtAxis}
                tick={AX}
                tickLine={false}
                axisLine={false}
                width={58}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar
                dataKey="value"
                name="Amount"
                radius={[3, 3, 0, 0]}
                barSize={26}
                fill={`${ACCENT}28`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Margin Comparison */}
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Margin Comparison</div>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart
              data={result.margins}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={AX}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={AX}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip />
              <Bar
                dataKey="margin"
                name="Margin %"
                fill={`${ACCENT}22`}
                radius={[3, 3, 0, 0]}
                barSize={36}
              />
              <Line
                type="monotone"
                dataKey="margin"
                stroke={ACCENT}
                strokeWidth={2}
                dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="pdf-table-title">P&L Summary</div>
      <table className="pdf-table">
        <thead>
          <tr>
            {["Line Item", "Amount", "% of Revenue"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map(([label, amount, pct], i) => (
            <tr
              key={i}
              style={
                label === "Gross Profit" ||
                label === "EBIT" ||
                label === "Net Profit"
                  ? { background: `${ACCENT}06` }
                  : {}
              }
            >
              <td
                style={
                  label === "Net Profit"
                    ? { color: ACCENT, fontWeight: 700 }
                    : label === "Gross Profit" || label === "EBIT"
                      ? { fontWeight: 600 }
                      : {}
                }
              >
                {label}
              </td>
              <td
                style={
                  label === "Net Profit"
                    ? { color: ACCENT, fontWeight: 700 }
                    : {}
                }
              >
                {amount}
              </td>
              <td>{pct}</td>
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
