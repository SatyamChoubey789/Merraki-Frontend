'use client';

import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  AreaChart, Area, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { CalcLayout, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = '#1D4ED8';
const RED    = '#DC2626';
const BORDER = 'rgba(10,10,20,0.08)';
const FAINT  = '#A0A0AE';
const WHITE  = '#FFFFFF';
const ax     = { fill: FAINT, fontSize: 9, fontFamily: FONT_MONO };

function fmtINR(n: number | null) {
  if (n === null || !isFinite(n)) return '∞';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}
function fmtNum(n: number | null) { return n === null ? '∞' : n.toLocaleString('en-IN'); }

function compute(p: { sellingPrice: number; variableCost: number; monthlyFixedCosts: number; startingUnits: number; monthlyGrowthRate: number; months: number }) {
  const contrib = p.sellingPrice - p.variableCost;
  const cm      = p.sellingPrice > 0 ? (contrib / p.sellingPrice) * 100 : 0;
  const beu     = contrib > 0 ? Math.ceil(p.monthlyFixedCosts / contrib) : null;
  const ber     = cm > 0 ? Math.round(p.monthlyFixedCosts / (cm / 100)) : null;
  const forecast: any[] = [];
  let cum = 0, bem: number | null = null;
  for (let m = 1; m <= p.months; m++) {
    const units   = m === 1 ? p.startingUnits : forecast[m-2].units * (1 + p.monthlyGrowthRate / 100);
    const rev     = units * p.sellingPrice;
    const profit  = rev - units * p.variableCost - p.monthlyFixedCosts;
    cum += profit;
    if (cum > 0 && bem === null) bem = m;
    forecast.push({ month: m, units: Math.round(units), revenue: Math.round(rev), fixedCost: p.monthlyFixedCosts, cumulativeProfit: Math.round(cum) });
  }
  return { contrib, cm, beu, ber, bem, forecast };
}

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', p: 1.25, minWidth: 140, boxShadow: '0 4px 12px rgba(10,10,20,0.1)' }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', letterSpacing: '0.1em', color: FAINT, mb: 0.5, textTransform: 'uppercase' }}>M{label}</Typography>
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

export function BreakevenCalculator() {
  const [p, setP] = useState({ sellingPrice: 1000, variableCost: 600, monthlyFixedCosts: 1000000, startingUnits: 1000, monthlyGrowthRate: 20, months: 24 });
  const set = (k: keyof typeof p) => (v: number) => setP(x => ({ ...x, [k]: v }));
  const r = useMemo(() => compute(p), [p]);
  const invalid = p.sellingPrice <= p.variableCost;
  const interval = Math.max(1, Math.floor(p.months / 6));

  return (
    <CalcLayout
      title="Break-Even Calculator"
      description="Units, revenue & month you turn profitable."
      accent={ACCENT} glyph="01"
      inputsPanel={
        <Box>
          <CalcInput label="Selling Price / Unit"  value={p.sellingPrice}       onChange={set('sellingPrice')}       prefix="₹" step={100} />
          <CalcInput label="Variable Cost / Unit"  value={p.variableCost}       onChange={set('variableCost')}       prefix="₹" step={100} />
          <CalcInput label="Monthly Fixed Costs"   value={p.monthlyFixedCosts}  onChange={set('monthlyFixedCosts')}  prefix="₹" step={10000} helperText="Rent, salaries, subscriptions" />
          <CalcInput label="Starting Units / Month"value={p.startingUnits}      onChange={set('startingUnits')}      step={10} />
          <CalcInput label="Monthly Growth Rate"   value={p.monthlyGrowthRate}  onChange={set('monthlyGrowthRate')}  suffix="%" step={0.5} helperText="Unit sales growth per month" />
          <CalcInput label="Forecast Months"       value={p.months}             onChange={set('months')}             min={3} step={1} />
          {invalid && (
            <Box sx={{ mt: 0.5, p: 1.25, borderRadius: '5px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)' }}>
              <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.7rem', color: RED }}>Selling price must exceed variable cost.</Typography>
            </Box>
          )}
        </Box>
      }
      resultsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 1 }}>
          <MetricCard label="Breakeven Month"   value={r.bem ? `Month ${r.bem}` : '—'} accent={ACCENT} highlight index={0} />
          <MetricCard label="Breakeven Units"   value={fmtNum(r.beu)}                  accent={ACCENT}          index={1} />
          <MetricCard label="Breakeven Revenue" value={fmtINR(r.ber)}                  accent={ACCENT}          index={2} />
          <MetricCard label="Contribution"      value={`${r.cm.toFixed(1)}%`}          accent={ACCENT} index={3} />
        </Box>
      }
      chartsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          <Box>
            <CLabel text="Cumulative Profit / Loss" />
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="beGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={ax} tickLine={false} axisLine={false} interval={interval} />
                <YAxis tickFormatter={v => v >= 1e6 ? `₹${(v/1e6).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <ReferenceLine y={0} stroke={BORDER} strokeDasharray="3 3" />
                {r.bem && <ReferenceLine x={r.bem} stroke={ACCENT} strokeDasharray="3 3" strokeWidth={1.5} label={{ value: `M${r.bem}`, fill: ACCENT, fontSize: 8, fontFamily: FONT_MONO }} />}
                <Area type="monotone" dataKey="cumulativeProfit" name="Cum. Profit" stroke={ACCENT} strokeWidth={1.5} fill="url(#beGrad)" dot={false} activeDot={{ r: 3, fill: ACCENT, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <CLabel text="Revenue vs Fixed Costs" />
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={r.forecast} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="month" tickFormatter={v => `M${v}`} tick={ax} tickLine={false} axisLine={false} interval={interval} />
                <YAxis tickFormatter={v => v >= 1e6 ? `₹${(v/1e6).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Bar dataKey="revenue" name="Revenue" fill={`${ACCENT}28`} radius={[2,2,0,0]} barSize={6} />
                <Line type="monotone" dataKey="fixedCost" name="Fixed Costs" stroke={RED} strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      }
    />
  );
}