'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { CalcLayout,FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

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

  /* Blue and light shades */
 
  blue:      "#3B82F6",             // main blue
  blueMid:   "#60A5FA",             // lighter mid-tone
  blueLight: "#93C5FD",             // soft/light blue
  blueGlow:  "rgba(59,130,246,0.07)", // subtle glow effect
  blueBdr:   "rgba(59,130,246,0.18)", // border/tint effect

  /* neutral/cool accents for footer */
  accents: [
    { line: "#3B82F6", glow: "rgba(59,130,246,0.055)" }, // soft blue
    { line: "#10B981", glow: "rgba(16,185,129,0.055)" }, // teal
    { line: "#64748B", glow: "rgba(100,116,139,0.055)" }, // cool gray
    { line: "#94A3B8", glow: "rgba(148,163,184,0.055)" }, // light gray-blue
  ],
};
function fmtINR(n: number) {
  if (n >= 10000000)  return `₹${(n/10000000).toFixed(2)}Cr`;
  if (n >= 100000)    return `₹${(n/100000).toFixed(1)}L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function compute(i: {
  currentRevenue: number; revenueGrowthRate: number; ebitdaMargin: number;
  discountRate: number; terminalGrowthRate: number; ebitdaMultiple: number; years: number;
}) {
  const forecast: any[] = [];
  let totalDCF = 0;
  for (let y = 1; y <= i.years; y++) {
    const revenue  = i.currentRevenue * Math.pow(1 + i.revenueGrowthRate/100, y);
    const ebitda   = revenue * (i.ebitdaMargin/100);
    const discount = Math.pow(1 + i.discountRate/100, y);
    const pv       = ebitda / discount;
    totalDCF += pv;
    forecast.push({ year: `Y${y}`, revenue: Math.round(revenue), ebitda: Math.round(ebitda), pv: Math.round(pv) });
  }
  const finalRevenue = i.currentRevenue * Math.pow(1 + i.revenueGrowthRate/100, i.years);
  const finalEbitda  = finalRevenue * (i.ebitdaMargin/100);
  const terminalValue = (finalEbitda * (1 + i.terminalGrowthRate/100)) / ((i.discountRate - i.terminalGrowthRate)/100);
  const tvPV = terminalValue / Math.pow(1 + i.discountRate/100, i.years);
  const dcfValuation = totalDCF + tvPV;
  const comparableValuation = finalEbitda * i.ebitdaMultiple;
  const blended = (dcfValuation + comparableValuation) / 2;
  return { dcfValuation, comparableValuation, blended, terminalValue, tvPV, totalDCF, forecast };
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', p: 2, boxShadow: '0 8px 32px rgba(12,14,18,0.1)', minWidth: 180 }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.58rem', letterSpacing: '0.12em', color: T.inkFaint, mb: 1, textTransform: 'uppercase' }}>{label}</Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2.5, mb: 0.35 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.75rem', color: T.inkMuted }}>{p.name}</Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 600, color: T.ink }}>{fmtINR(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function ChartLabel({ text }: { text: string }) {
  return <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.62rem', letterSpacing: '0.12em', color: T.inkMuted, textTransform: 'uppercase', mb: 2 }}>{text}</Typography>;
}

const axisStyle = { fill: T.inkFaint, fontSize: 11, fontFamily: FONT_MONO };

export function ValuationCalculator() {
  const [inputs, setInputs] = useState({
    currentRevenue: 10000000, revenueGrowthRate: 30, ebitdaMargin: 20,
    discountRate: 15, terminalGrowthRate: 4, ebitdaMultiple: 8, years: 5,
  });
  const set = (k: keyof typeof inputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }));
  const r = useMemo(() => compute(inputs), [inputs]);

  return (
    <CalcLayout
      title="Valuation Calculator"
      description="Build a 5-year DCF model with terminal value, cross-validated against comparable EBITDA multiples — the same framework used in investor presentations."
      accent={T.accents[0].line}
      glyph="02"
      inputsPanel={
        <Box>
          <CalcInput label="Current Annual Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} prefix="₹" step={500000} />
          <CalcInput label="Revenue Growth Rate" value={inputs.revenueGrowthRate} onChange={set('revenueGrowthRate')} suffix="%" step={1} helperText="Annual revenue growth %" />
          <CalcInput label="EBITDA Margin" value={inputs.ebitdaMargin} onChange={set('ebitdaMargin')} suffix="%" step={1} helperText="Earnings before interest, tax, D&A" />
          <CalcInput label="Discount Rate (WACC)" value={inputs.discountRate} onChange={set('discountRate')} suffix="%" step={0.5} helperText="Risk-adjusted cost of capital" />
          <CalcInput label="Terminal Growth Rate" value={inputs.terminalGrowthRate} onChange={set('terminalGrowthRate')} suffix="%" step={0.5} helperText="Long-run perpetual growth rate" />
          <CalcInput label="EBITDA Multiple" value={inputs.ebitdaMultiple} onChange={set('ebitdaMultiple')} suffix="x" step={0.5} helperText="Industry comparable multiple" />
          <CalcInput label="Forecast Years" value={inputs.years} onChange={set('years')} min={2} step={1} />
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          {[
            { label: 'DCF Valuation',        value: fmtINR(r.dcfValuation),        sub: 'discounted cash flow method',   highlight: true },
            { label: 'Comparable Valuation',  value: fmtINR(r.comparableValuation), sub: `${inputs.ebitdaMultiple}x EBITDA multiple` },
            { label: 'Blended Valuation',     value: fmtINR(r.blended),             sub: 'average of both methods' },
            { label: 'Terminal Value (PV)',    value: fmtINR(r.tvPV),               sub: 'present value of terminal' },
          ].map((m, i) => (
            <Grid key={m.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard label={m.label} value={m.value} subValue={m.sub} accent={T.accents[0].line} highlight={m.highlight} index={i} />
            </Grid>
          ))}
        </Grid>
      }
      chartsPanel={
        <Box>
          <ChartLabel text="Revenue & EBITDA Forecast" />
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={r.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accents[0].line} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={T.accents[0].line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="year" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => fmtINR(v)} tick={axisStyle} tickLine={false} axisLine={false} width={76} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Bar dataKey="revenue" name="Revenue" fill={T.accents[0].line + '40'} radius={[3,3,0,0]} barSize={28} />
              <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke={T.accents[0].line} strokeWidth={2} dot={{ fill: T.accents[0].line, r: 4, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 4, mb: 2 }}><ChartLabel text="Present Value of Cash Flows" /></Box>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={r.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accents[0].line} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={T.accents[0].line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="year" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => fmtINR(v)} tick={axisStyle} tickLine={false} axisLine={false} width={76} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="pv" name="Present Value" stroke={T.accents[0].line} strokeWidth={2} fill="url(#pvGrad)" dot={{ fill: T.accents[0].line, r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}