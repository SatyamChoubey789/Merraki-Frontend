'use client';

import { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalcLayout, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';

const ACCENT = '#1D4ED8';
const BORDER = 'rgba(10,10,20,0.08)';
const FAINT  = '#A0A0AE';
const WHITE  = '#FFFFFF';
const ax     = { fill: FAINT, fontSize: 9, fontFamily: FONT_MONO };

function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function compute(i: { revenue: number; cogs: number; operatingExpenses: number; interest: number; tax: number }) {
  const gross   = i.revenue - i.cogs;
  const gm      = i.revenue > 0 ? (gross / i.revenue) * 100 : 0;
  const opProfit= gross - i.operatingExpenses;
  const om      = i.revenue > 0 ? (opProfit / i.revenue) * 100 : 0;
  const ebt     = opProfit - i.interest;
  const taxAmt  = ebt > 0 ? (ebt * i.tax) / 100 : 0;
  const net     = ebt - taxAmt;
  const nm      = i.revenue > 0 ? (net / i.revenue) * 100 : 0;
  return {
    gross, gm, opProfit, om, net, nm, taxAmt,
    waterfall: [
      { name: 'Revenue',  value: i.revenue },
      { name: 'COGS',     value: -i.cogs },
      { name: 'Gross',    value: gross },
      { name: 'OpEx',     value: -i.operatingExpenses },
      { name: 'EBIT',     value: opProfit },
      { name: 'Interest', value: -i.interest },
      { name: 'Tax',      value: -taxAmt },
      { name: 'Net',      value: net },
    ],
    margins: [
      { name: 'Gross',     margin: parseFloat(gm.toFixed(1)) },
      { name: 'Operating', margin: parseFloat(om.toFixed(1)) },
      { name: 'Net',       margin: parseFloat(nm.toFixed(1)) },
    ],
  };
}

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: WHITE, border: `1px solid ${BORDER}`, borderRadius: '6px', p: 1.25, minWidth: 130, boxShadow: '0 4px 12px rgba(10,10,20,0.1)' }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', color: FAINT, mb: 0.5, textTransform: 'uppercase' }}>{label}</Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5, mb: 0.2 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.65rem', color: '#5A6478' }}>{p.name}</Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.65rem', fontWeight: 600, color: p.value < 0 ? '#DC2626' : '#0A0A0F' }}>
            {p.name?.includes('Margin') || p.name?.includes('%') ? `${p.value}%` : fmtINR(Math.abs(p.value))}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function CLabel({ text }: { text: string }) {
  return <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.46rem', letterSpacing: '0.12em', color: FAINT, textTransform: 'uppercase', mb: 1 }}>{text}</Typography>;
}

export function ProfitMarginCalculator() {
  const [p, setP] = useState({ revenue: 5000000, cogs: 2000000, operatingExpenses: 1000000, interest: 100000, tax: 25 });
  const set = (k: keyof typeof p) => (v: number) => setP(x => ({ ...x, [k]: v }));
  const r = useMemo(() => compute(p), [p]);

  return (
    <CalcLayout
      title="Profit Margin Calculator"
      description="Gross, operating & net margins in one view."
      accent={ACCENT} glyph="03"
      inputsPanel={
        <Box>
          <CalcInput label="Total Revenue"        value={p.revenue}           onChange={set('revenue')}           prefix="₹" step={50000} />
          <CalcInput label="Cost of Goods Sold"   value={p.cogs}              onChange={set('cogs')}              prefix="₹" step={50000} helperText="Direct production costs" />
          <CalcInput label="Operating Expenses"   value={p.operatingExpenses} onChange={set('operatingExpenses')} prefix="₹" step={10000} helperText="Salaries, rent, marketing" />
          <CalcInput label="Interest Expense"     value={p.interest}          onChange={set('interest')}          prefix="₹" step={5000} />
          <CalcInput label="Tax Rate"             value={p.tax}               onChange={set('tax')}               suffix="%" step={0.5} min={0} />
        </Box>
      }
      resultsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' }, gap: 1 }}>
          <MetricCard label="Gross Margin"     value={`${r.gm.toFixed(1)}%`}  accent={ACCENT} highlight index={0} />
          <MetricCard label="Operating Margin" value={`${r.om.toFixed(1)}%`}  accent={ACCENT}          index={1} />
          <MetricCard label="Net Margin"       value={`${r.nm.toFixed(1)}%`}  accent={ACCENT}          index={2} />
          <MetricCard label="Tax Paid"         value={fmtINR(r.taxAmt)}       accent={ACCENT}          index={3} />
        </Box>
      }
      chartsPanel={
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          <Box>
            <CLabel text="P&L Waterfall" />
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={r.waterfall} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="name" tick={ax} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => v >= 1e6 ? `₹${(v/1e6).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={ax} tickLine={false} axisLine={false} width={54} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Bar dataKey="value" name="Amount" radius={[3,3,0,0]} barSize={22} fill={`${ACCENT}30`} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <CLabel text="Margin Comparison" />
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={r.margins} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={BORDER} vertical={false} />
                <XAxis dataKey="name" tick={ax} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `${v}%`} tick={ax} tickLine={false} axisLine={false} width={36} />
                <Tooltip content={<Tip />} cursor={{ stroke: BORDER, strokeWidth: 1 }} />
                <Bar dataKey="margin" name="Margin %" fill={`${ACCENT}28`} radius={[3,3,0,0]} barSize={30} />
                <Line type="monotone" dataKey="margin" stroke={ACCENT} strokeWidth={1.5} dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      }
    />
  );
}