"use client";

import { useState, useMemo } from "react";
import { Box, Grid, Typography, Alert } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { colorTokens } from "@/theme";
import { CalcLayout } from "./CalcLayout";
import { CalcInput } from "./CalcInput";
import { MetricCard } from "./MetricCard";

const ACCENT = colorTokens.success.main;

function computeMargins(inputs: {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  taxes: number;
}) {
  const { revenue, cogs, operatingExpenses, taxes } = inputs;
  if (revenue <= 0) return null;

  const grossProfit = revenue - cogs;
  const grossMargin = (grossProfit / revenue) * 100;
  const operatingProfit = grossProfit - operatingExpenses;
  const operatingMargin = (operatingProfit / revenue) * 100;
  const netProfit = operatingProfit - taxes;
  const netMargin = (netProfit / revenue) * 100;

  return {
    grossProfit,
    grossMargin,
    operatingProfit,
    operatingMargin,
    netProfit,
    netMargin,
  };
}

function fmtINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ProfitMarginCalculator() {
  const [inputs, setInputs] = useState({
    revenue: 5000000,
    cogs: 2000000,
    operatingExpenses: 1000000,
    taxes: 300000,
  });

  const set = (key: keyof typeof inputs) => (v: number) =>
    setInputs((p) => ({ ...p, [key]: v }));

  const result = useMemo(() => computeMargins(inputs), [inputs]);

  const pieData = result
    ? [
        { name: "COGS", value: inputs.cogs, color: colorTokens.error.main },
        {
          name: "Operating Exp",
          value: inputs.operatingExpenses,
          color: colorTokens.warning.main,
        },
        { name: "Taxes", value: inputs.taxes, color: colorTokens.slate[400] },
        {
          name: "Net Profit",
          value: Math.max(result.netProfit, 0),
          color: ACCENT,
        },
      ]
    : [];

  const waterfallData = result
    ? [
        {
          name: "Revenue",
          value: inputs.revenue,
          fill: colorTokens.financeBlue[500],
        },
        {
          name: "Gross Profit",
          value: result.grossProfit,
          fill: colorTokens.financeBlue[400],
        },
        {
          name: "Operating Profit",
          value: result.operatingProfit,
          fill: colorTokens.warning.main,
        },
        {
          name: "Net Profit",
          value: result.netProfit,
          fill: result.netProfit >= 0 ? ACCENT : colorTokens.error.main,
        },
      ]
    : [];

  return (
    <CalcLayout
      title="Profit Margin Calculator"
      description="Understand gross, operating, and net profit margins. See exactly where your revenue goes and how much you actually keep."
      accent={ACCENT}
      inputsPanel={
        <Box>
          <CalcInput
            label="Total Revenue (₹)"
            value={inputs.revenue}
            onChange={set("revenue")}
            prefix="₹"
            step={50000}
            helperText="Your total sales / turnover"
          />
          <CalcInput
            label="Cost of Goods Sold — COGS (₹)"
            value={inputs.cogs}
            onChange={set("cogs")}
            prefix="₹"
            step={10000}
            helperText="Direct costs to produce/deliver"
          />
          <CalcInput
            label="Operating Expenses (₹)"
            value={inputs.operatingExpenses}
            onChange={set("operatingExpenses")}
            prefix="₹"
            step={10000}
            helperText="Rent, salaries, marketing, admin"
          />
          <CalcInput
            label="Taxes (₹)"
            value={inputs.taxes}
            onChange={set("taxes")}
            prefix="₹"
            step={5000}
            helperText="Income tax / GST liability"
          />

          {!result && (
            <Alert severity="warning" sx={{ borderRadius: "10px", mt: 1 }}>
              Enter a revenue greater than 0.
            </Alert>
          )}

          {result && (
            <Box
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: "14px",
                backgroundColor: colorTokens.success.light,
                border: `1px solid ${colorTokens.success.main}33`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.success.dark,
                  fontWeight: 700,
                  display: "block",
                  mb: 1.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Quick Summary
              </Typography>
              {[
                {
                  label: "Gross Margin",
                  value: `${result.grossMargin.toFixed(1)}%`,
                },
                {
                  label: "Operating Margin",
                  value: `${result.operatingMargin.toFixed(1)}%`,
                },
                {
                  label: "Net Margin",
                  value: `${result.netMargin.toFixed(1)}%`,
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: colorTokens.success.dark, fontWeight: 500 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 800,
                      color: colorTokens.success.dark,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      }
      resultsPanel={
        result ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <MetricCard
                label="Gross Profit"
                value={fmtINR(result.grossProfit)}
                subValue={`${result.grossMargin.toFixed(1)}% gross margin`}
                accent={colorTokens.financeBlue[500]}
                bg={colorTokens.financeBlue[50]}
                icon="📦"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <MetricCard
                label="Operating Profit"
                value={fmtINR(result.operatingProfit)}
                subValue={`${result.operatingMargin.toFixed(1)}% operating margin`}
                accent={colorTokens.warning.main}
                bg={colorTokens.warning.light}
                icon="⚙️"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <MetricCard
                label="Net Profit"
                value={fmtINR(result.netProfit)}
                subValue={`${result.netMargin.toFixed(1)}% net margin`}
                accent={result.netProfit >= 0 ? ACCENT : colorTokens.error.main}
                bg={
                  result.netProfit >= 0
                    ? colorTokens.success.light
                    : colorTokens.error.light
                }
                icon={result.netProfit >= 0 ? "✅" : "⚠️"}
                highlight={result.netProfit >= 0}
              />
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">
            Enter values above to see results.
          </Typography>
        )
      }
      chartsPanel={
        result ? (
          <Box>
            <Grid container spacing={3}>
              {/* Pie — revenue breakdown */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: colorTokens.darkNavy[800],
                    mb: 2,
                  }}
                >
                  Revenue Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData.filter((d) => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v?: number) => [fmtINR(v ?? 0)]}
                      contentStyle={{
                        borderRadius: "10px",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8125rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>

              {/* Bar — profit waterfall */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: colorTokens.darkNavy[800],
                    mb: 2,
                  }}
                >
                  Profit Waterfall
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={waterfallData}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={colorTokens.slate[100]}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: colorTokens.slate[500], fontSize: 11 }}
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
                      formatter={(v?: number) => [fmtINR(v ?? 0)]}
                      contentStyle={{
                        borderRadius: "10px",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {waterfallData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Box>
        ) : null
      }
    />
  );
}
