'use client';

import { useState, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { CalcLayout, T, FONT_MONO, FONT_SANS } from './CalcLayout';
import { CalcInput } from './CalcInput';
import { MetricCard } from './MetricCard';
import { Typography } from '@mui/material';

const ACCENT = '#5C7A5C';

function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function compute(i: { revenue: number; cogs: number; operatingExpenses: number; interest: number; tax: number }) {
  const grossProfit    = i.revenue - i.cogs;
  const grossMargin    = i.revenue > 0 ? (grossProfit / i.revenue) * 100 : 0;
  const operatingProfit = grossProfit - i.operatingExpenses;
  const operatingMargin = i.revenue > 0 ? (operatingProfit / i.revenue) * 100 : 0;
  const ebt            = operatingProfit - i.interest;
  const taxAmount      = ebt > 0 ? (ebt * i.tax) / 100 : 0;
  const netProfit      = ebt - taxAmount;
  const netMargin      = i.revenue > 0 ? (netProfit / i.revenue) * 100 : 0;
  const waterfall = [
    { name: 'Revenue',    value: i.revenue,           type: 'total' },
    { name: 'COGS',       value: -i.cogs,             type: 'cost'  },
    { name: 'Gross',      value: grossProfit,          type: 'sub'   },
    { name: 'OpEx',       value: -i.operatingExpenses, type: 'cost'  },
    { name: 'EBIT',       value: operatingProfit,      type: 'sub'   },
    { name: 'Interest',   value: -i.interest,          type: 'cost'  },
    { name: 'Tax',        value: -taxAmount,           type: 'cost'  },
    { name: 'Net Profit', value: netProfit,            type: 'final' },
  ];
  const margins = [
    { name: 'Gross',     margin: parseFloat(grossMargin.toFixed(1)) },
    { name: 'Operating', margin: parseFloat(operatingMargin.toFixed(1)) },
    { name: 'Net',       margin: parseFloat(netMargin.toFixed(1)) },
  ];
  return { grossProfit, grossMargin, operatingProfit, operatingMargin, netProfit, netMargin, taxAmount, waterfall, margins };
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', p: 2, boxShadow: '0 8px 32px rgba(12,14,18,0.1)', minWidth: 160 }}>
      <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.58rem', letterSpacing: '0.12em', color: T.inkFaint, mb: 1, textTransform: 'uppercase' }}>{label}</Typography>
      {payload.map((p: any) => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.35 }}>
          <Typography sx={{ fontFamily: FONT_SANS, fontSize: '0.75rem', color: T.inkMuted }}>{p.name}</Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', fontWeight: 600, color: p.value >= 0 ? T.ink : '#DC2626' }}>
            {typeof p.value === 'number' ? (p.name?.includes('%') || p.name?.includes('Margin') ? `${p.value}%` : fmtINR(Math.abs(p.value))) : p.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function ChartLabel({ text }: { text: string }) {
  return <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.62rem', letterSpacing: '0.12em', color: T.inkMuted, textTransform: 'uppercase', mb: 2 }}>{text}</Typography>;
}

const axisStyle = { fill: T.inkFaint, fontSize: 11, fontFamily: FONT_MONO };

export function ProfitMarginCalculator() {
  const [inputs, setInputs] = useState({ revenue: 5000000, cogs: 2000000, operatingExpenses: 1000000, interest: 100000, tax: 25 });
  const set = (k: keyof typeof inputs) => (v: number) => setInputs(p => ({ ...p, [k]: v }));
  const r = useMemo(() => compute(inputs), [inputs]);

  return (
    <CalcLayout
      title="Profit Margin Calculator"
      description="Analyse your gross, operating, and net margins — see exactly where revenue is consumed and how efficiently you convert sales into profit."
      accent={ACCENT}
      glyph="03"
      inputsPanel={
        <Box>
          <CalcInput label="Total Revenue" value={inputs.revenue} onChange={set('revenue')} prefix="₹" step={50000} />
          <CalcInput label="Cost of Goods Sold (COGS)" value={inputs.cogs} onChange={set('cogs')} prefix="₹" step={50000} helperText="Direct production or service delivery costs" />
          <CalcInput label="Operating Expenses" value={inputs.operatingExpenses} onChange={set('operatingExpenses')} prefix="₹" step={10000} helperText="Salaries, rent, marketing, overheads" />
          <CalcInput label="Interest Expense" value={inputs.interest} onChange={set('interest')} prefix="₹" step={5000} />
          <CalcInput label="Tax Rate" value={inputs.tax} onChange={set('tax')} suffix="%" step={0.5} min={0} />
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          {[
            { label: 'Gross Margin',     value: `${r.grossMargin.toFixed(1)}%`,     sub: fmtINR(r.grossProfit),     highlight: true },
            { label: 'Operating Margin', value: `${r.operatingMargin.toFixed(1)}%`, sub: fmtINR(r.operatingProfit) },
            { label: 'Net Margin',       value: `${r.netMargin.toFixed(1)}%`,       sub: fmtINR(r.netProfit) },
            { label: 'Tax Paid',         value: fmtINR(r.taxAmount),               sub: `${inputs.tax}% rate` },
          ].map((m, i) => (
            <Grid key={m.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard label={m.label} value={m.value} subValue={m.sub} accent={ACCENT} highlight={m.highlight} index={i} />
            </Grid>
          ))}
        </Grid>
      }
      chartsPanel={
        <Box>
          <ChartLabel text="P&L Waterfall" />
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={r.waterfall} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => v >= 1000000 ? `₹${(v/1000000).toFixed(1)}M` : `₹${(v/1000).toFixed(0)}K`} tick={axisStyle} tickLine={false} axisLine={false} width={72} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Bar dataKey="value" name="Amount" radius={[4,4,0,0]} barSize={28}
                fill={ACCENT + '88'}
                label={false}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 4, mb: 2 }}><ChartLabel text="Margin Comparison" /></Box>
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={r.margins} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={axisStyle} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={axisStyle} tickLine={false} axisLine={false} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
              <Bar dataKey="margin" name="Margin %" fill={ACCENT + '55'} radius={[4,4,0,0]} barSize={36} />
              <Line type="monotone" dataKey="margin" stroke={ACCENT} strokeWidth={2} dot={{ fill: ACCENT, r: 4, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      }
    />
  );
}