'use client';

import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CalcLayout, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = '#1D4ED8';
const BORDER = 'rgba(10,10,20,0.08)';
const FAINT  = '#A0A0AE';
const WHITE  = '#FFFFFF';
const ax     = { fill: FAINT, fontSize: 9, fontFamily: FONT_MONO };

function fmtINR(n: number) {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n/100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function compute(i: { currentRevenue: number; revenueGrowthRate: number; ebitdaMargin: number; discountRate: number; terminalGrowthRate: number; ebitdaMultiple: number; years: number }) {
  const forecast: any[] = [];
  let totalDCF = 0;
  for (let y = 1; y <= i.years; y++) {
    const revenue = i.currentRevenue * Math.pow(1 + i.revenueGrowthRate/100, y);
    const ebitda  = revenue * (i.ebitdaMargin/100);
    const pv      = ebitda / Math.pow(1 + i.discountRate/100, y);
    totalDCF += pv;
    forecast.push({ year: `Y${y}`, revenue: Math.round(revenue), ebitda: Math.round(ebitda), pv: Math.round(pv) });
  }
  const finalEbitda = i.currentRevenue * Math.pow(1 + i.revenueGrowthRate/100, i.years) * (i.ebitdaMargin/100);
  const tv   = (finalEbitda * (1 + i.terminalGrowthRate/100)) / ((i.discountRate - i.terminalGrowthRate)/100);
  const tvPV = tv / Math.pow(1 + i.discountRate/100, i.years);
  const dcf  = totalDCF + tvPV;
  const comp = finalEbitda * i.ebitdaMultiple;
  return { dcf, comp, blended: (dcf + comp) / 2, tvPV, forecast };
}

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', p: 1.25, minWidth: 140, boxShadow: '0 4px 12px rgba(10,10,20,0.1)' }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', color: FAINT, mb: 0.5, textTransform: 'uppercase' }}>{label}</Typography>
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

export function ValuationCalculator() {
  const [p, setP] = useState({ currentRevenue: 10000000, revenueGrowthRate: 30, ebitdaMargin: 20, discountRate: 15, terminalGrowthRate: 4, ebitdaMultiple: 8, years: 5 });
  const set = (k: keyof typeof p) => (v: number) => setP(x => ({ ...x, [k]: v }));
  const r = useMemo(() => compute(p), [p]);

  return (
    <CalcLayout
      title="Valuation Calculator"
      description="DCF + EBITDA multiple — investor-grade valuation."
      accent={ACCENT} glyph="02"
      inputsPanel={
        <Box>
          <CalcInput label="Annual Revenue"        value={p.currentRevenue}    onChange={set('currentRevenue')}    prefix="₹" step={500000} />
          <CalcInput label="Revenue Growth Rate"   value={p.revenueGrowthRate} onChange={set('revenueGrowthRate')} suffix="%" step={1}   helperText="Annual revenue growth %" />
          <CalcInput label="EBITDA Margin"         value={p.ebitdaMargin}      onChange={set('ebitdaMargin')}      suffix="%" step={1}   helperText="% of revenue before interest & tax" />
          <CalcInput label="Discount Rate (WACC)"  value={p.discountRate}      onChange={set('discountRate')}      suffix="%" step={0.5} helperText="Risk-adjusted cost of capital" />
          <CalcInput label="Terminal Growth Rate"  value={p.terminalGrowthRate}onChange={set('terminalGrowthRate')}suffix="%" step={0.5} helperText="Long-run perpetual growth" />
          <CalcInput label="EBITDA Multiple"       value={p.ebitdaMultiple}    onChange={set('ebitdaMultiple')}    suffix="x" step={0.5} helperText="Industry comparable" />
          <CalcInput label="Forecast Years"        value={p.years}             onChange={set('years')}             min={2} step={1} />
        </Box>
      }
      resultsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 1 }}>
          <MetricCard label="DCF Valuation"   value={fmtINR(r.dcf)}     accent={ACCENT} highlight index={0} />
          <MetricCard label="Comparable"      value={fmtINR(r.comp)}    accent={ACCENT}          index={1} />
          <MetricCard label="Blended"         value={fmtINR(r.blended)} accent={ACCENT}          index={2} />
          <MetricCard label="Terminal (PV)"   value={fmtINR(r.tvPV)}    accent={ACCENT}          index={3} />
        </Box>
      }
      chartsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          <Box>
            <CLabel text="Revenue & EBITDA" />
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="year" tick={ax} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => fmtINR(v)} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Bar dataKey="revenue" name="Revenue" fill={`${ACCENT}28`} radius={[2,2,0,0]} barSize={20} />
                <Line type="monotone" dataKey="ebitda" name="EBITDA" stroke={ACCENT} strokeWidth={1.5} dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <CLabel text="Present Value of Cash Flows" />
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="year" tick={ax} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => fmtINR(v)} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Area type="monotone" dataKey="pv" name="Present Value" stroke={ACCENT} strokeWidth={1.5} fill="url(#pvGrad)" dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      }
    />
  );
}