'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { CalcLayout, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

// ------------------ COLORS (cool-only palette) ------------------
const T = {
  /* surfaces */
  white:     "#FFFFFF",
  offwhite:  "#F9F8F5",
  cream:     "#F0EDE6",
  parchment: "#E8E4DA",

  /* text */
  ink:       "#0C0E12",
  inkMid:    "#2E3440",
  inkMuted:  "#64748B",
  inkFaint:  "#94A3B8",
  inkGhost:  "#CBD5E1",

  /* borders */
  border:    "#E2DED5",
  borderMd:  "#C8C3B8",

  /* blue / cool shades */
  blue:      "#3B82F6",
  blueMid:   "#60A5FA",
  blueLight: "#93C5FD",
  blueGlow:  "rgba(59,130,246,0.07)",
  blueBdr:   "rgba(59,130,246,0.18)",

  /* cool accents for charts/footer */
  accents: [
    { line: "#3B82F6", glow: "rgba(59,130,246,0.055)" }, // primary blue
    { line: "#10B981", glow: "rgba(16,185,129,0.055)" }, // teal
    { line: "#64748B", glow: "rgba(100,116,139,0.055)" }, // gray
    { line: "#94A3B8", glow: "rgba(148,163,184,0.055)" }, // light gray-blue
  ],
};

// ------------------ CALCULATION LOGIC ------------------
function computeBreakeven(inputs: {
  sellingPrice: number; variableCost: number; monthlyFixedCosts: number;
  startingUnits: number; monthlyGrowthRate: number; months: number;
}) {
  const { sellingPrice, variableCost, monthlyFixedCosts, startingUnits, monthlyGrowthRate, months } = inputs;
  const contributionPerUnit = sellingPrice - variableCost;
  const contributionMarginPct = sellingPrice > 0 ? (contributionPerUnit / sellingPrice) * 100 : 0;
  const breakevenUnits = contributionPerUnit > 0 ? monthlyFixedCosts / contributionPerUnit : Infinity;
  const breakevenRevenue = contributionMarginPct > 0 ? monthlyFixedCosts / (contributionMarginPct / 100) : Infinity;

  const forecast: any[] = [];
  let cumulative = 0;
  let breakevenMonth: number | null = null;

  for (let m = 1; m <= months; m++) {
    const units = m === 1 ? startingUnits : forecast[m - 2].units * (1 + monthlyGrowthRate / 100);
    const revenue = units * sellingPrice;
    const varCost = units * variableCost;
    const profit = revenue - varCost - monthlyFixedCosts;
    cumulative += profit;
    if (cumulative > 0 && breakevenMonth === null) breakevenMonth = m;

    forecast.push({
      month: m,
      units: Math.round(units),
      revenue: Math.round(revenue),
      variableCost: Math.round(varCost),
      fixedCost: monthlyFixedCosts,
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cumulative),
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

function fmtINR(n: number | null) {
  if (n === null || !isFinite(n)) return '∞';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtNum(n: number | null) { return n === null ? '∞' : n.toLocaleString('en-IN'); }

// ------------------ CHART TOOLTIP ------------------
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', p: 2, minWidth: 190, boxShadow: '0 8px 32px rgba(12,14,18,0.1)' }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.58rem', letterSpacing: '0.12em', color: T.inkFaint, mb: 1, textTransform: 'uppercase' }}>
        Month {label}
      </Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2.5, mb: 0.4 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.75rem', color: T.inkMuted }}>{p.name}</Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 600, color: T.ink }}>
            {typeof p.value === 'number' ? (p.value < 0 ? `-${fmtINR(Math.abs(p.value))}` : fmtINR(p.value)) : p.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function ChartLabel({ text }: { text: string }) {
  return (
    <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.62rem', letterSpacing: '0.12em', color: T.inkMuted, textTransform: 'uppercase', mb: 2 }}>
      {text}
    </Typography>
  );
}

// ------------------ MAIN COMPONENT ------------------
export function BreakevenCalculator() {
  const [inputs, setInputs] = useState({
    sellingPrice: 1000, variableCost: 600, monthlyFixedCosts: 1000000,
    startingUnits: 1000, monthlyGrowthRate: 20, months: 24,
  });
  const set = (key: keyof typeof inputs) => (v: number) => setInputs(p => ({ ...p, [key]: v }));
  const result = useMemo(() => computeBreakeven(inputs), [inputs]);
  const invalid = inputs.sellingPrice <= inputs.variableCost;
  const axisStyle = { fill: T.inkFaint, fontSize: 11, fontFamily: FONT_MONO };

  return (
    <CalcLayout
      title="Break-Even Calculator"
      description="Find exactly how many units you need to sell, what revenue covers your costs, and in which month you turn profitable — with a full 24-month forecast."
      accent={T.accents[0].line}
      glyph="01"
      inputsPanel={
        <Box>
          <CalcInput label="Selling Price per Unit" value={inputs.sellingPrice} onChange={set('sellingPrice')} prefix="₹" step={100} />
          <CalcInput label="Variable Cost per Unit" value={inputs.variableCost} onChange={set('variableCost')} prefix="₹" step={100} />
          <CalcInput label="Monthly Fixed Costs" value={inputs.monthlyFixedCosts} onChange={set('monthlyFixedCosts')} prefix="₹" step={10000} helperText="Rent, salaries, subscriptions, etc." />
          <CalcInput label="Starting Monthly Units Sold" value={inputs.startingUnits} onChange={set('startingUnits')} step={10} />
          <CalcInput label="Monthly Growth Rate" value={inputs.monthlyGrowthRate} onChange={set('monthlyGrowthRate')} suffix="%" step={0.5} helperText="How fast your unit sales grow each month" />
          <CalcInput label="Forecast Months" value={inputs.months} onChange={set('months')} min={3} step={1} />
          {invalid && (
            <Box sx={{ mt: 1, p: 2, borderRadius: '9px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)' }}>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.8rem', color: '#DC2626' }}>
                Selling price must exceed variable cost per unit.
              </Typography>
            </Box>
          )}
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          {[
            { label: 'Breakeven Month', value: result.breakevenMonth ? `Month ${result.breakevenMonth}` : 'Not reached', sub: 'first profitable month', highlight: true },
            { label: 'Breakeven Units', value: fmtNum(result.breakevenUnits), sub: 'units per month' },
            { label: 'Breakeven Revenue', value: fmtINR(result.breakevenRevenue), sub: 'monthly revenue needed' },
            { label: 'Contribution Margin', value: `${result.contributionMarginPct.toFixed(1)}%`, sub: `₹${result.contributionPerUnit.toLocaleString()} per unit` },
          ].map((m, i) => (
            <Grid key={m.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard label={m.label} value={m.value} subValue={m.sub} accent={T.accents[0].line} highlight={m.highlight} index={i} />
            </Grid>
          ))}
        </Grid>
      }
      chartsPanel={
        <Box>
          {/* Cumulative Profit Chart */}
          <ChartLabel text="Cumulative Profit / Loss Over Time" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={result.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="beProfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accents[0].line} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={T.accents[0].line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => v >= 1000000 ? `₹${(v/1000000).toFixed(1)}M` : v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`} tick={axisStyle} tickLine={false} axisLine={false} width={68} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <ReferenceLine y={0} stroke={T.borderMd} strokeDasharray="4 3" strokeWidth={1} />
              {result.breakevenMonth && (
                <ReferenceLine x={result.breakevenMonth} stroke={T.accents[0].line} strokeDasharray="4 3" strokeWidth={1.5} label={{ value: `M${result.breakevenMonth}`, fill: T.accents[0].line, fontSize: 10, fontFamily: FONT_MONO, fontWeight: 700 }} />
              )}
              <Area type="monotone" dataKey="cumulativeProfit" name="Cumulative Profit" stroke={T.accents[0].line} strokeWidth={2} fill="url(#beProfGrad)" dot={false} activeDot={{ r: 4, fill: T.accents[0].line, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Revenue vs Costs Chart */}
          <Box sx={{ mt: 4, mb: 2 }}><ChartLabel text="Monthly Revenue vs Costs" /></Box>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={result.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => v >= 1000000 ? `₹${(v/1000000).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={axisStyle} tickLine={false} axisLine={false} width={68} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Legend wrapperStyle={{ fontFamily: FONT_SANS, fontSize: '0.75rem', paddingTop: 12, color: T.inkMuted }} />
              <Bar dataKey="revenue" name="Revenue" fill={T.accents[0].line + '44'} radius={[3,3,0,0]} barSize={10} />
              <Line type="monotone" dataKey="fixedCost" name="Fixed Costs" stroke="#DC2626" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}