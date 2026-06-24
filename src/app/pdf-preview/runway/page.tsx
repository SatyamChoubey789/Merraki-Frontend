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
import { PDFHeader, PDFMetricCard, PDFFooter, fmtINR } from "../PdfShared";

import "../print.css";

const ACCENT = "#0D7A5F";

export default function RunwayPDFPreview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = (window as any).__PDF_DATA__;
    if (raw) setData(raw);
  }, []);

  if (!data) return null;

  const { result, companyName, cashBalance } = data;
  const AX = { fontSize: 7, fill: "#9CA3AF", fontFamily: "Inter, sans-serif" };

  return (
    <div className="pdf-page" style={{ "--accent": ACCENT } as any}>
      <PDFHeader
        title="Runway Calculator"
        company={companyName}
        accent={ACCENT}
      />

      <div className="pdf-metrics">
        <PDFMetricCard
          label="Runway"
          value={result.runway === null ? "Cash +ve" : `${result.runway} mo`}
          accent={ACCENT}
          highlight
        />
        <PDFMetricCard
          label="Net Burn / Mo"
          value={fmtINR(result.netBurn)}
          accent={ACCENT}
        />
        <PDFMetricCard
          label="Cash Depleted"
          value={result.exhausted ? `Month ${result.exhausted}` : "Never"}
          accent={ACCENT}
        />
        <PDFMetricCard
          label="Starting Cash"
          value={fmtINR(cashBalance)}
          accent={ACCENT}
        />
      </div>

      <div className="pdf-charts">
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Cash Balance Over Time</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={result.forecast}>
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
                interval={5}
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
                width={58}
              />
              <Tooltip formatter={(v: any) => fmtINR(v)} />
              <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="3 3" />
              {result.exhausted && (
                <ReferenceLine
                  x={result.exhausted}
                  stroke="#DC2626"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `M${result.exhausted}`,
                    fill: "#DC2626",
                    fontSize: 9,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="cashBalance"
                stroke={ACCENT}
                strokeWidth={2}
                fill={`${ACCENT}22`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="pdf-chart-box">
          <div className="pdf-chart-label">Revenue vs Burn Rate</div>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={result.forecast}>
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
                interval={5}
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
                width={58}
              />
              <Tooltip formatter={(v: any) => fmtINR(v)} />
              <Bar
                dataKey="revenue"
                fill={`${ACCENT}20`}
                barSize={6}
                radius={[2, 2, 0, 0]}
              />
              <Line
                dataKey="burn"
                stroke="#DC2626"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pdf-table-title">Runway Forecast (Key Months)</div>
      <table className="pdf-table">
        <thead>
          <tr>
            {["Month", "Revenue", "Burn", "Net", "Cash Balance"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.forecast.map((r: any) => (
            <tr key={r.month}>
              <td>Month {r.month}</td>
              <td>{fmtINR(r.revenue)}</td>
              <td>{fmtINR(r.burn)}</td>
              <td>{fmtINR(r.net)}</td>
              <td>{fmtINR(r.cashBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PDFFooter />
    </div>
  );
}
