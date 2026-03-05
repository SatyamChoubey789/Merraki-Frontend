'use client';

import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { CalcLayout, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = '#1D4ED8';
const RED    = '#DC2626';
const BORDER = 'rgba(10,10,20,0.08)';
const FAINT  = '#A0A0AE';
const WHITE  = '#FFFFFF';
const ax     = { fill: FAINT, fontSize: 9, fontFamily: FONT_MONO };

function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function compute(i: { cashBalance: number; monthlyRevenue: number; revenueGrowthRate: number; monthlyBurn: number; burnGrowthRate: number }) {
  const netBurn = i.monthlyBurn - i.monthlyRevenue;
  const runwayMonths = netBurn > 0 ? Math.floor(i.cashBalance / netBurn) : Infinity;
  const forecast: any[] = [];
  let cash = i.cashBalance, exhausted: number | null = null;
  for (let m = 1; m <= 36; m++) {
    const rev  = m === 1 ? i.monthlyRevenue : forecast[m-2].revenue * (1 + i.revenueGrowthRate/100);
    const burn = m === 1 ? i.monthlyBurn    : forecast[m-2].burn    * (1 + i.burnGrowthRate/100);
    cash += rev - burn;
    if (cash <= 0 && exhausted === null) exhausted = m;
    forecast.push({ month: m, revenue: Math.round(rev), burn: Math.round(burn), cashBalance: Math.max(0, Math.round(cash)) });
  }
  return { netBurn: Math.round(netBurn), runway: isFinite(runwayMonths) ? runwayMonths : null, exhausted, forecast };
}

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', p: 1.25, minWidth: 150, boxShadow: '0 4px 12px rgba(10,10,20,0.1)' }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', color: FAINT, mb: 0.5, textTransform: 'uppercase' }}>M{label}</Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mb: 0.2 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.65rem', color: '#5A6478' }}>{p.name}</Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 600, color: '#0A0A0F' }}>{fmtINR(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function CLabel({ text }: { text: string }) {
  return <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', letterSpacing: '0.12em', color: FAINT, textTransform: 'uppercase', mb: 1 }}>{text}</Typography>;
}

export function RunwayCalculator() {
  const [p, setP] = useState({ cashBalance: 5000000, monthlyRevenue: 500000, revenueGrowthRate: 10, monthlyBurn: 800000, burnGrowthRate: 2 });
  const set = (k: keyof typeof p) => (v: number) => setP(x => ({ ...x, [k]: v }));
  const r = useMemo(() => compute(p), [p]);

  return (
    <CalcLayout
      title="Runway Calculator"
      description="How long your cash lasts at current burn rate."
      accent={ACCENT} glyph="04"
      inputsPanel={
        <Box>
          <CalcInput label="Current Cash Balance"  value={p.cashBalance}       onChange={set('cashBalance')}       prefix="₹" step={100000} helperText="Total cash in bank" />
          <CalcInput label="Monthly Revenue"       value={p.monthlyRevenue}    onChange={set('monthlyRevenue')}    prefix="₹" step={10000} />
          <CalcInput label="Revenue Growth / Mo"   value={p.revenueGrowthRate} onChange={set('revenueGrowthRate')} suffix="%" step={0.5} helperText="Monthly % revenue growth" />
          <CalcInput label="Monthly Burn"          value={p.monthlyBurn}       onChange={set('monthlyBurn')}       prefix="₹" step={10000} helperText="All monthly outflows" />
          <CalcInput label="Burn Growth / Mo"      value={p.burnGrowthRate}    onChange={set('burnGrowthRate')}    suffix="%" step={0.5} helperText="Monthly % increase in costs" />
        </Box>
      }
      resultsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 1 }}>
          <MetricCard label="Runway"        value={r.runway === null ? 'Cash +ve' : `${r.runway} mo`} accent={ACCENT} highlight index={0} />
          <MetricCard label="Net Burn / Mo" value={fmtINR(r.netBurn)}  accent={ACCENT}          index={1} />
          <MetricCard label="Cash Depleted" value={r.exhausted ? `Month ${r.exhausted}` : 'Never'}   accent={ACCENT}          index={2} />
          <MetricCard label="Cash Balance"  value={fmtINR(p.cashBalance)} accent={ACCENT}          index={3} />
        </Box>
      }
      chartsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          <Box>
            <CLabel text="Cash Balance Over Time" />
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={ax} tickLine={false} axisLine={false} interval={5} />
                <YAxis tickFormatter={v => v >= 1e6 ? `₹${(v/1e6).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <ReferenceLine y={0} stroke={BORDER} strokeDasharray="3 3" />
                {r.exhausted && <ReferenceLine x={r.exhausted} stroke={RED} strokeDasharray="3 3" strokeWidth={1.5} label={{ value: `M${r.exhausted}`, fill: RED, fontSize: 8, fontFamily: FONT_MONO }} />}
                <Area type="monotone" dataKey="cashBalance" name="Cash" stroke={ACCENT} strokeWidth={1.5} fill="url(#cashGrad)" dot={false} activeDot={{ r: 3, fill: ACCENT, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <CLabel text="Revenue vs Burn" />
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={ax} tickLine={false} axisLine={false} interval={5} />
                <YAxis tickFormatter={v => v >= 1e6 ? `₹${(v/1e6).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Bar dataKey="revenue" name="Revenue" fill={`${ACCENT}28`} radius={[2,2,0,0]} barSize={6} />
                <Line type="monotone" dataKey="burn" name="Burn" stroke={RED} strokeWidth={1.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      }
    />
  );
}