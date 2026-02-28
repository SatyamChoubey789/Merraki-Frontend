'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Typography, Alert } from '@mui/material';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { colorTokens } from '@/theme';
import { CalcLayout } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = colorTokens.financeBlue[500];

// ── Exact formula from your Breakeven sheet ──────────────────────────────────
function computeBreakeven(inputs: {
  sellingPrice: number;
  variableCost: number;
  monthlyFixedCosts: number;
  startingUnits: number;
  monthlyGrowthRate: number;
  months: number;
}) {
  const {
    sellingPrice,
    variableCost,
    monthlyFixedCosts,
    startingUnits,
    monthlyGrowthRate,
    months,
  } = inputs;

  // B11 = Contribution per Unit = B5 - B6
  const contributionPerUnit = sellingPrice - variableCost;

  // B12 = Break-even Units = B7 / B11
  const breakevenUnits = contributionPerUnit > 0
    ? monthlyFixedCosts / contributionPerUnit
    : Infinity;

  // B13 = Contribution Margin % = B11 / B5
  const contributionMarginPct = sellingPrice > 0
    ? (contributionPerUnit / sellingPrice) * 100
    : 0;

  // B14 = Break-even Revenue = B7 / B13
  const breakevenRevenue = contributionMarginPct > 0
    ? monthlyFixedCosts / (contributionMarginPct / 100)
    : Infinity;

  // Monthly forecast — each row from your sheet
  const forecast: {
    month: number;
    units: number;
    revenue: number;
    variableCost: number;
    fixedCost: number;
    profit: number;
    cumulativeProfit: number;
    breakeven: boolean;
  }[] = [];

  let cumulative = 0;
  let breakevenMonth: number | null = null;

  for (let m = 1; m <= months; m++) {
    // Units: B8 for month 1, then B_prev * (1 + B9/100)
    const units =
      m === 1
        ? startingUnits
        : forecast[m - 2].units * (1 + monthlyGrowthRate / 100);

    const revenue = units * sellingPrice;
    const varCost = units * variableCost;
    const profit = revenue - varCost - monthlyFixedCosts;
    cumulative += profit;
    const isBreakeven = cumulative > 0;

    if (isBreakeven && breakevenMonth === null) {
      breakevenMonth = m;
    }

    forecast.push({
      month: m,
      units: Math.round(units),
      revenue: Math.round(revenue),
      variableCost: Math.round(varCost),
      fixedCost: monthlyFixedCosts,
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulative),
      breakeven: isBreakeven,
    });
  }

  return {
    contributionPerUnit,
    contributionMarginPct,
    breakevenUnits: isFinite(breakevenUnits) ? Math.ceil(breakevenUnits) : null,
    breakevenRevenue: isFinite(breakevenRevenue) ? Math.round(breakevenRevenue) : null,
    breakevenMonth,
    forecast,
  };
}

function fmtINR(n: number | null): string {
  if (n === null || !isFinite(n)) return '∞';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n: number | null): string {
  if (n === null) return '∞';
  return n.toLocaleString('en-IN');
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        background: colorTokens.darkNavy[900],
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: '12px',
        p: 2,
        minWidth: 200,
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1, fontWeight: 600 }}
      >
        Month {label}
      </Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: p.color, fontWeight: 600 }}>
            {p.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>
            {typeof p.value === 'number'
              ? p.value < 0
                ? `-${fmtINR(Math.abs(p.value))}`
                : fmtINR(p.value)
              : p.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export function BreakevenCalculator() {
  const [inputs, setInputs] = useState({
    sellingPrice: 1000,
    variableCost: 600,
    monthlyFixedCosts: 1000000,
    startingUnits: 1000,
    monthlyGrowthRate: 20,
    months: 24,
  });

  const set = (key: keyof typeof inputs) => (v: number) =>
    setInputs((p) => ({ ...p, [key]: v }));

  const result = useMemo(() => computeBreakeven(inputs), [inputs]);
  const isInvalid =
    inputs.sellingPrice <= inputs.variableCost;

  return (
    <CalcLayout
      title="Break-Even Calculator"
      description="Find exactly how many units you need to sell, what revenue covers your costs, and in which month you turn profitable — with a full 24-month forecast."
      accent={ACCENT}
      inputsPanel={
        <Box>
          <CalcInput
            label="Selling Price per Unit (₹)"
            value={inputs.sellingPrice}
            onChange={set('sellingPrice')}
            prefix="₹"
            step={100}
          />
          <CalcInput
            label="Variable Cost per Unit (₹)"
            value={inputs.variableCost}
            onChange={set('variableCost')}
            prefix="₹"
            step={100}
          />
          <CalcInput
            label="Monthly Fixed Costs (₹)"
            value={inputs.monthlyFixedCosts}
            onChange={set('monthlyFixedCosts')}
            prefix="₹"
            step={10000}
            helperText="Rent, salaries, subscriptions, etc."
          />
          <CalcInput
            label="Starting Monthly Units Sold"
            value={inputs.startingUnits}
            onChange={set('startingUnits')}
            step={10}
          />
          <CalcInput
            label="Monthly Growth Rate (%)"
            value={inputs.monthlyGrowthRate}
            onChange={set('monthlyGrowthRate')}
            suffix="%"
            step={0.5}
            helperText="How fast your unit sales grow each month"
          />
          <CalcInput
            label="Forecast Months"
            value={inputs.months}
            onChange={set('months')}
            min={3}
            step={1}
          />

          {isInvalid && (
            <Alert severity="error" sx={{ borderRadius: '10px', mt: 1, fontSize: '0.8125rem' }}>
              Selling price must exceed variable cost per unit.
            </Alert>
          )}
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Breakeven Month"
              value={result.breakevenMonth ? `Month ${result.breakevenMonth}` : 'Not reached'}
              subValue="first profitable month"
              accent={ACCENT}
              bg={colorTokens.financeBlue[50]}
              icon="🎯"
              highlight
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Breakeven Units"
              value={fmtNum(result.breakevenUnits)}
              subValue="units per month"
              accent={ACCENT}
              bg={colorTokens.financeBlue[50]}
              icon="📦"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Breakeven Revenue"
              value={fmtINR(result.breakevenRevenue)}
              subValue="monthly revenue needed"
              accent={ACCENT}
              bg={colorTokens.financeBlue[50]}
              icon="💰"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Contribution Margin"
              value={`${result.contributionMarginPct.toFixed(1)}%`}
              subValue={`₹${result.contributionPerUnit.toLocaleString()} per unit`}
              accent={colorTokens.success.main}
              bg={colorTokens.success.light}
              icon="📊"
            />
          </Grid>
        </Grid>
      }
      chartsPanel={
        <Box>
          {/* Cumulative Profit Chart */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mb: 2 }}
          >
            Cumulative Profit / Loss Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={result.forecast}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ACCENT} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorTokens.error.main} stopOpacity={0.14} />
                  <stop offset="95%" stopColor={colorTokens.error.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.slate[100]} />
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
                    : v >= 1000
                    ? `₹${(v / 1000).toFixed(0)}K`
                    : `₹${v}`
                }
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={0}
                stroke={colorTokens.slate[300]}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'Breakeven',
                  fill: colorTokens.slate[500],
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
              {result.breakevenMonth && (
                <ReferenceLine
                  x={result.breakevenMonth}
                  stroke={colorTokens.success.main}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Month ${result.breakevenMonth}`,
                    fill: colorTokens.success.main,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="cumulativeProfit"
                name="Cumulative Profit"
                stroke={ACCENT}
                strokeWidth={2.5}
                fill="url(#profitGrad)"
                dot={false}
                activeDot={{ r: 5, fill: ACCENT, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Monthly Revenue vs Costs */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mt: 4, mb: 2 }}
          >
            Monthly Revenue vs Costs
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart
              data={result.forecast}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colorTokens.slate[100]} />
              <XAxis
                dataKey="month"
                tickFormatter={(v) => `M${v}`}
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) =>
                  v >= 1000000 ? `₹${(v / 1000000).toFixed(1)}M` : `₹${(v / 1000).toFixed(0)}K`
                }
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  paddingTop: '12px',
                }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill={`${ACCENT}55`}
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Line
                type="monotone"
                dataKey="fixedCost"
                name="Fixed Costs"
                stroke={colorTokens.error.main}
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}