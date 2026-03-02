'use client';

import { useState, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { CalcLayout, T, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = '#8B5E3C';

function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function compute(i: { cashBalance: number; monthlyRevenue: number; revenueGrowthRate: number; monthlyBurn: number; burnGrowthRate: number }) {
  const netBurn = i.monthlyBurn - i.monthlyRevenue;
  const runwayMonths = netBurn > 0 ? Math.floor(i.cashBalance / netBurn) : Infinity;
  const forecast: any[] = [];
  let cash = i.cashBalance;
  let exhaustedMonth: number | null = null;
  for (let m = 1; m <= 36; m++) {
    const revenue = m === 1 ? i.monthlyRevenue : forecast[m-2].revenue * (1 + i.revenueGrowthRate/100);
    const burn    = m === 1 ? i.monthlyBurn    : forecast[m-2].burn    * (1 + i.burnGrowthRate/100);
    const net     = revenue - burn;
    cash += net;
    if (cash <= 0 && exhaustedMonth === null) exhaustedMonth = m;
    forecast.push({ month: m, revenue: Math.round(revenue), burn: Math.round(burn), net: Math.round(net), cashBalance: Math.max(0, Math.round(cash)) });
  }
  return { netBurn: Math.round(netBurn), runwayMonths: isFinite(runwayMonths) ? runwayMonths : null, exhaustedMonth, forecast };
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', p: 2, boxShadow: '0 8px 32px rgba(12,14,18,0.1)', minWidth: 180 }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.58rem', letterSpacing: '0.12em', color: T.inkFaint, mb: 1, textTransform: 'uppercase' }}>Month {label}</Typography>
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

export function RunwayCalculator() {
  const [inputs, setInputs] = useState({ cashBalance: 5000000, monthlyRevenue: 500000, revenueGrowthRate: 10, monthlyBurn: 800000, burnGrowthRate: 2 });
  const set = (k: keyof typeof inputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }));
  const r = useMemo(() => compute(inputs), [inputs]);

  const runwayDisplay = r.runwayMonths === null ? 'Cash positive' : `${r.runwayMonths} months`;

  return (
    <CalcLayout
      title="Runway Calculator"
      description="See exactly how long your cash will last, when you reach zero, and how revenue growth vs burn rate affect your survival timeline."
      accent={ACCENT}
      glyph="04"
      inputsPanel={
        <Box>
          <CalcInput label="Current Cash Balance" value={inputs.cashBalance} onChange={set('cashBalance')} prefix="₹" step={100000} helperText="Total cash in bank right now" />
          <CalcInput label="Monthly Revenue" value={inputs.monthlyRevenue} onChange={set('monthlyRevenue')} prefix="₹" step={10000} />
          <CalcInput label="Revenue Growth Rate" value={inputs.revenueGrowthRate} onChange={set('revenueGrowthRate')} suffix="%" step={0.5} helperText="Monthly % growth in revenue" />
          <CalcInput label="Monthly Burn (Total Costs)" value={inputs.monthlyBurn} onChange={set('monthlyBurn')} prefix="₹" step={10000} helperText="All monthly outflows incl. salaries" />
          <CalcInput label="Burn Growth Rate" value={inputs.burnGrowthRate} onChange={set('burnGrowthRate')} suffix="%" step={0.5} helperText="Monthly % increase in costs" />
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          {[
            { label: 'Runway',        value: runwayDisplay,            sub: 'months until cash zero',   highlight: true },
            { label: 'Net Burn / Mo', value: fmtINR(r.netBurn),        sub: r.netBurn > 0 ? 'burning cash' : 'cash positive' },
            { label: 'Cash Depleted', value: r.exhaustedMonth ? `Month ${r.exhaustedMonth}` : 'Never', sub: 'at current trajectory' },
            { label: 'Starting Cash', value: fmtINR(inputs.cashBalance), sub: 'current balance' },
          ].map((m, i) => (
            <Grid key={m.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard label={m.label} value={m.value} subValue={m.sub} accent={ACCENT} highlight={m.highlight} index={i} />
            </Grid>
          ))}
        </Grid>
      }
      chartsPanel={
        <Box>
          <ChartLabel text="Cash Balance Over Time" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={r.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => v >= 1000000 ? `₹${(v/1000000).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={axisStyle} tickLine={false} axisLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <ReferenceLine y={0} stroke={T.borderMd} strokeDasharray="4 3" strokeWidth={1} />
              {r.exhaustedMonth && (
                <ReferenceLine x={r.exhaustedMonth} stroke="#DC2626" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: `M${r.exhaustedMonth}`, fill: '#DC2626', fontSize: 10, fontFamily: FONT_MONO, fontWeight: 700 }} />
              )}
              <Area type="monotone" dataKey="cashBalance" name="Cash Balance" stroke={ACCENT} strokeWidth={2} fill="url(#cashGrad)" dot={false} activeDot={{ r: 4, fill: ACCENT, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 4, mb: 2 }}><ChartLabel text="Revenue vs Burn Rate" /></Box>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={r.forecast} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => v >= 1000000 ? `₹${(v/1000000).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={axisStyle} tickLine={false} axisLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Bar dataKey="revenue" name="Revenue" fill={ACCENT + '44'} radius={[3,3,0,0]} barSize={8} />
              <Line type="monotone" dataKey="burn" name="Burn" stroke="#DC2626" strokeWidth={1.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}