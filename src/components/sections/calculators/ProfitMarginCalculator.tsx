"use client";

import { useState, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  T,
  SANS,
  EASE,
  AX,
  CalcInput,
  MetricCard,
  CalcComputing,
  CalcButton,
  DataTable,
  ExportBtn,
  NextCalcBtn,
  ChartTip,
  EmptyChart,
  CLabel,
} from "./Calcshared";
import { CalcPageLayout } from "./Calcpagelayout";


import ExportModal from "./ExportModal";

const ACCENT = "#0D7A5F";

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Params {
  revenue: number | "";
  cogs: number | "";
  operatingExpenses: number | "";
  interest: number | "";
  tax: number | "";
}

function compute(i: Params) {
  const revenue = Number(i.revenue || 0);
  const cogs = Number(i.cogs || 0);
  const operatingExpenses = Number(i.operatingExpenses || 0);
  const interest = Number(i.interest || 0);
  const tax = Number(i.tax || 0);

  const gross = revenue - cogs;
  const gm = revenue > 0 ? (gross / revenue) * 100 : 0;
  const opProfit = gross - operatingExpenses;
  const om = revenue > 0 ? (opProfit / revenue) * 100 : 0;
  const ebt = opProfit - interest;
  const taxAmt = ebt > 0 ? (ebt * tax) / 100 : 0;
  const net = ebt - taxAmt;
  const nm = revenue > 0 ? (net / revenue) * 100 : 0;
  return {
    gross,
    gm,
    opProfit,
    om,
    net,
    nm,
    taxAmt,
    waterfall: [
      { name: "Revenue", value: revenue, color: ACCENT },
      { name: "COGS", value: -cogs, color: T.red },
      { name: "Gross", value: gross, color: ACCENT },
      { name: "OpEx", value: -operatingExpenses, color: T.red },
      { name: "EBIT", value: opProfit, color: ACCENT },
      { name: "Interest", value: -interest, color: T.red },
      { name: "Tax", value: -taxAmt, color: T.red },
      { name: "Net", value: net, color: ACCENT },
    ],
    margins: [
      { name: "Gross", margin: parseFloat(gm.toFixed(1)) },
      { name: "Operating", margin: parseFloat(om.toFixed(1)) },
      { name: "Net", margin: parseFloat(nm.toFixed(1)) },
    ],
  };
}

export default function ProfitMarginCalculatorPage() {
  const [p, setP] = useState<Params>({
    revenue: "",
    cogs: "",
    operatingExpenses: "",
    interest: "",
    tax: "",
  });
  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof compute> | null>(null);


  const [exportModalOpen, setExportModalOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Params) => (v: number | "") => {
    setP((x) => ({ ...x, [k]: v }));
  };

  const handleCalc = () => {
    setResult(null);
    setComputing(true);
  };
  const handleDone = () => {
    setComputing(false);
    setResult(compute(p));
  };

  const tableRows = useMemo(() => {
    if (!result) return [];

    const revenue = Number(p.revenue || 0);
    const cogs = Number(p.cogs || 0);
    const operatingExpenses = Number(p.operatingExpenses || 0);
    const interest = Number(p.interest || 0);
    const tax = Number(p.tax || 0);

    return [
      ["Revenue", fmtINR(revenue), "100.0%"],
      [
        "Cost of Goods Sold",
        fmtINR(cogs),
        revenue ? `${((cogs / revenue) * 100).toFixed(1)}%` : "0.0%",
      ],
      ["Gross Profit", fmtINR(result.gross), `${result.gm.toFixed(1)}%`],
      [
        "Operating Expenses",
        fmtINR(operatingExpenses),
        revenue
          ? `${((operatingExpenses / revenue) * 100).toFixed(1)}%`
          : "0.0%",
      ],
      ["EBIT", fmtINR(result.opProfit), `${result.om.toFixed(1)}%`],
      ["Interest", fmtINR(interest), "—"],
      ["Tax", fmtINR(result.taxAmt), `${tax}%`],
      ["Net Profit", fmtINR(result.net), `${result.nm.toFixed(1)}%`],
    ];
  }, [result, p]);

  return (
    <CalcPageLayout
      title="Profit Margin Calculator"
      description="Enter your revenue, costs, and expenses to get clear insights into your business profitability and make smarter financial decisions."
      accent={ACCENT}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            background: T.bg,
            borderRadius: "16px",
            border: `1px solid ${T.border}`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderBottom: `1px solid ${T.border}`,
              background: T.bgSection,
            }}
          >
            <Typography
              sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: "0.875rem",
                color: T.ink,
              }}
            >
              Inputs
            </Typography>
          </Box>
          <Box sx={{ p: 2.5 }}>
            <CalcInput
              label="Total Revenue"
              value={p.revenue}
              onChange={set("revenue")}
              prefix="₹"
              step={50000}
            />
            <CalcInput
              label="Cost of Goods Sold"
              value={p.cogs}
              onChange={set("cogs")}
              prefix="₹"
              step={50000}
              helperText="Direct production costs"
            />
            <CalcInput
              label="Operating Expenses"
              value={p.operatingExpenses}
              onChange={set("operatingExpenses")}
              prefix="₹"
              step={10000}
              helperText="Salaries, rent, marketing"
            />
            <CalcInput
              label="Interest Expense"
              value={p.interest}
              onChange={set("interest")}
              prefix="₹"
              step={5000}
            />
            <CalcInput
              label="Tax Rate"
              value={p.tax}
              onChange={set("tax")}
              suffix="%"
              step={0.5}
              min={0}
            />
            <CalcButton
              onClick={handleCalc}
              loading={computing}
              hasResult={!!result}
            />
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" },
              gap: 1.5,
              mb: 3,
            }}
          >
            <MetricCard
              label="Gross Margin"
              value={result ? `${result.gm.toFixed(1)}%` : "—"}
              accent={ACCENT}
              highlight
            />
            <MetricCard
              label="Operating Margin"
              value={result ? `${result.om.toFixed(1)}%` : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Net Margin"
              value={result ? `${result.nm.toFixed(1)}%` : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Tax Paid"
              value={result ? fmtINR(result.taxAmt) : "—"}
              accent={ACCENT}
            />
          </Box>

          <Box
            ref={resultRef}
            sx={{
              background: T.bg,
              borderRadius: "16px",
              border: `1px solid ${T.border}`,
              p: { xs: 2, md: 3 },
              position: "relative",
            }}
          >
            <CalcComputing
              visible={computing}
              onDone={handleDone}
              duration={2400}
            />
            <AnimatePresence>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Box>
                      <CLabel text="P&L Waterfall" />
                      <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                          data={result.waterfall}
                          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tickFormatter={(v) =>
                              v >= 1e6
                                ? `₹${(v / 1e6).toFixed(1)}M`
                                : `₹${(v / 1000).toFixed(0)}K`
                            }
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            width={58}
                          />
                          <Tooltip
                            content={<ChartTip formatVal={fmtINR} />}
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <Bar
                            dataKey="value"
                            name="Amount"
                            radius={[3, 3, 0, 0]}
                            barSize={26}
                            fill={`${ACCENT}28`}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box>
                      <CLabel text="Margin Comparison" />
                      <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                          data={result.margins}
                          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="name"
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tickFormatter={(v) => `${v}%`}
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            width={36}
                          />
                          <Tooltip
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <Bar
                            dataKey="margin"
                            name="Margin %"
                            fill={`${ACCENT}22`}
                            radius={[3, 3, 0, 0]}
                            barSize={36}
                          />
                          <Line
                            type="monotone"
                            dataKey="margin"
                            stroke={ACCENT}
                            strokeWidth={2}
                            dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                  <DataTable
                    title="P&L Summary"
                    columns={["Line Item", "Amount", "% of Revenue"]}
                    rows={tableRows}
                  />
                  <Box
                    data-export-actions
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 3,
                      pt: 3,
                      borderTop: `1px solid ${T.border}`,
                    }}
                  >
                    {/* ── CHANGED: open modal instead of direct export ── */}
                    <ExportBtn
                      onClick={() => setExportModalOpen(true)}
                      loading={false}
                    />
                    <NextCalcBtn
                      label="Runway Calculator"
                      href="/calculators/runway"
                    />
                  </Box>
                </motion.div>
              ) : !computing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <CLabel text="P&L Waterfall" />
                      <EmptyChart />
                    </Box>
                    <Box>
                      <CLabel text="Margin Comparison" />
                      <EmptyChart />
                    </Box>
                  </Box>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* ── NEW: Export Modal ─────────────────────────────────────────────── */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        calculatorName="Profit Margin Calculator"
        result={result}
      />
    </CalcPageLayout>
  );
}
