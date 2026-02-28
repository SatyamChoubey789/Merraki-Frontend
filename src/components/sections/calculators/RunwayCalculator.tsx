"use client";

import { useState, useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { colorTokens } from "@/theme";
import { CalcLayout } from "./CalcLayout";
import { CalcInput } from "./CalcInput";
import { MetricCard } from "./MetricCard";
import { formatDate } from "@/lib/utils/formatters";

const ACCENT = colorTokens.warning.main;

const STATUS_CONFIG = {
  profitable: {
    label: "🎉 Revenue Positive",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
  },
  healthy: {
    label: "✅ Healthy Runway",
    color: colorTokens.success.main,
    bg: colorTokens.success.light,
  },
  warning: {
    label: "⚠️ Watch Carefully",
    color: colorTokens.warning.main,
    bg: colorTokens.warning.light,
  },
  critical: {
    label: "🚨 Critical — Act Now",
    color: colorTokens.error.main,
    bg: colorTokens.error.light,
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG; // 'profitable' | 'healthy' | 'warning' | 'critical'

function computeRunway(inputs: {
  currentCash: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
  months: number;
}) {
  const { currentCash, monthlyBurnRate, monthlyRevenue, months } = inputs;
  const netBurn = monthlyBurnRate - monthlyRevenue;

  const forecast: {
    month: number;
    cash: number;
    revenue: number;
    burn: number;
    netBurn: number;
  }[] = [];

  let cash = currentCash;
  let runwayMonths: number | null = null;

  for (let m = 1; m <= months; m++) {
    cash = cash - netBurn;
    if (cash <= 0 && runwayMonths === null) {
      runwayMonths = m - 1;
    }
    forecast.push({
      month: m,
      cash: Math.max(Math.round(cash), 0),
      revenue: monthlyRevenue,
      burn: monthlyBurnRate,
      netBurn: netBurn,
    });
  }

  const runwayDate =
    runwayMonths !== null
      ? new Date(Date.now() + runwayMonths * 30 * 24 * 60 * 60 * 1000)
      : null;

  const status: StatusKey =
    netBurn <= 0
      ? "profitable"
      : runwayMonths === null
        ? "healthy"
        : runwayMonths < 3
          ? "critical"
          : runwayMonths < 6
            ? "warning"
            : "healthy";

  const monthsOfRunway = runwayMonths ?? (netBurn <= 0 ? Infinity : months);

  return {
    forecast,
    runwayMonths: monthsOfRunway,
    runwayDate,
    netBurn,
    status,
  };
}

function fmtINR(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function RunwayCalculator() {
  const [inputs, setInputs] = useState({
    currentCash: 5000000,
    monthlyBurnRate: 500000,
    monthlyRevenue: 200000,
    months: 24,
  });

  const set = (key: keyof typeof inputs) => (v: number) =>
    setInputs((p) => ({ ...p, [key]: v }));

  const result = useMemo(() => computeRunway(inputs), [inputs]);
  const statusConfig = STATUS_CONFIG[result.status];

  return (
    <CalcLayout
      title="Runway Calculator"
      description="How many months until you run out of cash? Track your burn rate, net burn, and project exactly when you need to raise — or become profitable."
      accent={ACCENT}
      inputsPanel={
        <Box>
          <CalcInput
            label="Current Cash / Bank Balance (₹)"
            value={inputs.currentCash}
            onChange={set("currentCash")}
            prefix="₹"
            step={100000}
            helperText="Total cash available today"
          />
          <CalcInput
            label="Monthly Burn Rate (₹)"
            value={inputs.monthlyBurnRate}
            onChange={set("monthlyBurnRate")}
            prefix="₹"
            step={10000}
            helperText="Total monthly expenses"
          />
          <CalcInput
            label="Monthly Revenue (₹)"
            value={inputs.monthlyRevenue}
            onChange={set("monthlyRevenue")}
            prefix="₹"
            step={10000}
            helperText="Current monthly revenue (MRR)"
          />
          <CalcInput
            label="Forecast Months"
            value={inputs.months}
            onChange={set("months")}
            min={3}
            step={1}
          />

          {/* Status */}
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: "14px",
              backgroundColor: statusConfig.bg,
              border: `1px solid ${statusConfig.color}33`,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: statusConfig.color, mb: 1 }}
            >
              {statusConfig.label}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: statusConfig.color, opacity: 0.8, lineHeight: 1.5 }}
            >
              Net Burn: <strong>{fmtINR(Math.abs(result.netBurn))}/mo</strong>
              {result.netBurn < 0 ? " (net positive ✓)" : " outflow"}
            </Typography>
          </Box>
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Runway"
              value={
                result.status === "profitable"
                  ? "∞ Profitable"
                  : isFinite(result.runwayMonths)
                    ? `${result.runwayMonths} months`
                    : `${inputs.months}+ months`
              }
              subValue={
                result.runwayDate
                  ? `Cash out: ${result.runwayDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`
                  : "No cash-out projected"
              }
              accent={statusConfig.color}
              bg={statusConfig.bg}
              icon="⏱️"
              highlight
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Net Burn / Month"
              value={fmtINR(Math.abs(result.netBurn))}
              subValue={
                result.netBurn <= 0 ? "Net positive" : "Monthly cash outflow"
              }
              accent={
                result.netBurn <= 0
                  ? colorTokens.success.main
                  : colorTokens.error.main
              }
              bg={
                result.netBurn <= 0
                  ? colorTokens.success.light
                  : colorTokens.error.light
              }
              icon="🔥"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Monthly Burn"
              value={fmtINR(inputs.monthlyBurnRate)}
              subValue="Total monthly expenses"
              accent={ACCENT}
              bg={colorTokens.warning.light}
              icon="💸"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Monthly Revenue"
              value={fmtINR(inputs.monthlyRevenue)}
              subValue={`${((inputs.monthlyRevenue / inputs.monthlyBurnRate) * 100).toFixed(0)}% of burn covered`}
              accent={colorTokens.financeBlue[500]}
              bg={colorTokens.financeBlue[50]}
              icon="💚"
            />
          </Grid>
        </Grid>
      }
      chartsPanel={
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mb: 2 }}
          >
            Cash Runway Projection
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={result.forecast}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colorTokens.slate[100]}
              />
              <XAxis
                dataKey="month"
                tickFormatter={(v) => `M${v}`}
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `₹${(v / 1000000).toFixed(1)}M`
                    : `₹${(v / 1000).toFixed(0)}K`
                }
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                formatter={(v?: number, name?: string) => [
                  fmtINR(v ?? 0),
                  name ?? "",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colorTokens.slate[200]}`,
                  fontFamily: "var(--font-body)",
                }}
              />
              {isFinite(result.runwayMonths) &&
                result.status !== "profitable" && (
                  <ReferenceLine
                    x={result.runwayMonths}
                    stroke={colorTokens.error.main}
                    strokeDasharray="5 3"
                    strokeWidth={2}
                    label={{
                      value: `Cash Out M${result.runwayMonths}`,
                      fill: colorTokens.error.main,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                )}
              <Area
                type="monotone"
                dataKey="cash"
                name="Cash Balance"
                stroke={ACCENT}
                strokeWidth={2.5}
                fill="url(#cashGrad)"
                dot={false}
                activeDot={{ r: 5, fill: ACCENT, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}
