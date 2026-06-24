"use client";

import { useState, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  T,
  SANS,
  MONO,
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

const ACCENT = "#3B7BF6";

function fmtINR(n: number | null) {
  if (n === null || !isFinite(n)) return "∞";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtNum(n: number | null) {
  return n === null ? "∞" : n.toLocaleString("en-IN");
}

type FieldVal = number | "";

interface Params {
  sellingPrice: FieldVal;
  variableCost: FieldVal;
  monthlyFixedCosts: FieldVal;
  startingUnits: FieldVal;
  monthlyGrowthRate: FieldVal;
  months: FieldVal;
}

function toNum(v: FieldVal): number {
  return v === "" ? 0 : v;
}

function compute(p: Params) {
  const sellingPrice = toNum(p.sellingPrice);
  const variableCost = toNum(p.variableCost);
  const monthlyFixedCosts = toNum(p.monthlyFixedCosts);
  const startingUnits = toNum(p.startingUnits);
  const monthlyGrowthRate = toNum(p.monthlyGrowthRate);
  const months = toNum(p.months);

  const contrib = sellingPrice - variableCost;
  const cm = sellingPrice > 0 ? (contrib / sellingPrice) * 100 : 0;
  const beu = contrib > 0 ? Math.ceil(monthlyFixedCosts / contrib) : null;
  const ber = cm > 0 ? Math.round(monthlyFixedCosts / (cm / 100)) : null;

  const forecast: any[] = [];
  let cum = 0;
  let bem: number | null = null;

  for (let m = 1; m <= months; m++) {
    const units =
      m === 1
        ? startingUnits
        : forecast[m - 2].units * (1 + monthlyGrowthRate / 100);
    const rev = units * sellingPrice;
    const vc = units * variableCost;
    const profit = rev - vc - monthlyFixedCosts;
    cum += profit;
    if (cum > 0 && bem === null) bem = m;
    forecast.push({
      month: m,
      units: Math.round(units),
      revenue: Math.round(rev),
      varCost: Math.round(vc),
      fixedCost: monthlyFixedCosts,
      profit: Math.round(profit),
      cumulativeProfit: Math.round(cum),
    });
  }

  return { contrib, cm, beu, ber, bem, forecast };
}

export default function BreakevenCalculatorPage() {
  const [p, setP] = useState<Params>({
    sellingPrice: "",
    variableCost: "",
    monthlyFixedCosts: "",
    startingUnits: "",
    monthlyGrowthRate: "",
    months: "",
  });

  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof compute> | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const set = (k: keyof Params) => (v: number | "") =>
    setP((prev) => ({ ...prev, [k]: v }));

  const invalid =
    toNum(p.sellingPrice) <= toNum(p.variableCost) && toNum(p.sellingPrice) > 0;

  const interval = result ? Math.max(1, Math.floor(toNum(p.months) / 6)) : 1;

  const handleCalc = () => {
    if (invalid) return;
    setResult(null);
    setComputing(true);
  };

  const handleDone = () => {
    setComputing(false);
    setResult(compute(p));
  };

  const tableRows = useMemo(
    () =>
      result?.forecast.map((r) => [
        `Month ${r.month}`,
        fmtNum(r.units),
        fmtINR(r.revenue),
        fmtINR(r.varCost),
        fmtINR(r.fixedCost),
        fmtINR(r.profit),
        fmtINR(r.cumulativeProfit),
      ]) ?? [],
    [result],
  );

  return (
    <CalcPageLayout
      title="Break-Even Calculator"
      description="Find when you start making profit. See how many units, revenue, and months it takes to break even."
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
        {/* ── INPUT PANEL ── */}
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
                letterSpacing: "-0.01em",
              }}
            >
              Inputs & Details
            </Typography>
          </Box>

          <Box sx={{ p: 2.5 }}>
            <CalcInput
              label="Selling Price / Unit"
              value={p.sellingPrice}
              onChange={set("sellingPrice")}
              prefix="₹"
              step={100}
              helperText="Price you charge for one item"
            />
            <CalcInput
              label="Variable Cost / Unit"
              value={p.variableCost}
              onChange={set("variableCost")}
              prefix="₹"
              step={100}
              helperText="Cost to make one item"
            />
            <CalcInput
              label="Monthly Fixed Costs"
              value={p.monthlyFixedCosts}
              onChange={set("monthlyFixedCosts")}
              prefix="₹"
              step={10000}
              helperText="Rent, salaries, subscriptions, etc."
            />
            <CalcInput
              label="Starting / Current Sales (Month 1)"
              value={p.startingUnits}
              onChange={set("startingUnits")}
              step={10}
              helperText="Items you are selling or expect to sell in the first month"
            />
            <CalcInput
              label="Monthly Sales Growth (%)"
              value={p.monthlyGrowthRate}
              onChange={set("monthlyGrowthRate")}
              suffix="%"
              step={0.5}
              helperText="How much sales increase each month (in %)"
            />
            <CalcInput
              label="Forecast Period (months)"
              value={p.months}
              onChange={set("months")}
              min={3}
              step={1}
              helperText="How many months to calculate"
            />

            {invalid && (
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: "8px",
                  background: "rgba(220,38,38,0.05)",
                  border: "1px solid rgba(220,38,38,0.18)",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.red }}
                >
                  Selling price must exceed variable cost.
                </Typography>
              </Box>
            )}

            <CalcButton
              onClick={handleCalc}
              loading={computing}
              hasResult={!!result}
            />
          </Box>
        </Box>

        {/* ── RESULTS PANEL ── */}
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
              label="Breakeven Month"
              value={result ? (result.bem ? `Month ${result.bem}` : "—") : "—"}
              accent={ACCENT}
              highlight
            />
            <MetricCard
              label="Breakeven Units"
              value={result ? fmtNum(result.beu) : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Breakeven Revenue"
              value={result ? fmtINR(result.ber) : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Contribution Margin"
              value={result ? `${result.cm.toFixed(1)}%` : "—"}
              accent={ACCENT}
            />
          </Box>

          <Box
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
              duration={2600}
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
                      <CLabel text="Cumulative Profit / Loss" />
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={result.forecast}>
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tickFormatter={(v) => `M${v}`}
                            tick={AX}
                            axisLine={false}
                            tickLine={false}
                            interval={interval}
                          />
                          <YAxis
                            tickFormatter={(v) =>
                              v >= 1e6
                                ? `₹${(v / 1e6).toFixed(1)}M`
                                : `₹${(v / 1e3).toFixed(0)}K`
                            }
                            tick={AX}
                            axisLine={false}
                            tickLine={false}
                            width={58}
                          />
                          <Tooltip
                            content={<ChartTip formatVal={fmtINR} />}
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <ReferenceLine
                            y={0}
                            stroke={T.border}
                            strokeDasharray="3 3"
                          />
                          {result.bem && (
                            <ReferenceLine
                              x={result.bem}
                              stroke={ACCENT}
                              strokeDasharray="3 3"
                              strokeWidth={1.5}
                              label={{
                                value: `M${result.bem}`,
                                fill: ACCENT,
                                fontSize: 9,
                                fontFamily: MONO,
                              }}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="cumulativeProfit"
                            stroke={ACCENT}
                            strokeWidth={2}
                            fill={`${ACCENT}22`}
                            dot={false}
                            activeDot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box>
                      <CLabel text="Revenue vs Fixed Costs" />
                      <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart data={result.forecast}>
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tickFormatter={(v) => `M${v}`}
                            tick={AX}
                            axisLine={false}
                            tickLine={false}
                            interval={interval}
                          />
                          <YAxis
                            tickFormatter={(v) =>
                              v >= 1e6
                                ? `₹${(v / 1e6).toFixed(1)}M`
                                : `₹${(v / 1e3).toFixed(0)}K`
                            }
                            tick={AX}
                            axisLine={false}
                            tickLine={false}
                            width={58}
                          />
                          <Tooltip
                            content={<ChartTip formatVal={fmtINR} />}
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <Bar
                            dataKey="revenue"
                            fill={`${ACCENT}22`}
                            barSize={6}
                            radius={[2, 2, 0, 0]}
                          />
                          <Line
                            dataKey="fixedCost"
                            stroke={T.red}
                            strokeWidth={1.5}
                            strokeDasharray="4 3"
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  <DataTable
                    title="Monthly Forecast"
                    columns={[
                      "Month",
                      "Units",
                      "Revenue",
                      "Var. Costs",
                      "Fixed Costs",
                      "Profit",
                      "Cumulative",
                    ]}
                    rows={tableRows}
                  />

                  {/* data-export-actions hides this row during PDF capture */}
                  <Box
                    data-export-actions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 3,
                      pt: 3,
                      borderTop: `1px solid ${T.border}`,
                    }}
                  >
                    <ExportBtn
                      onClick={() => setExportModalOpen(true)}
                      loading={false}
                    />
                    <NextCalcBtn
                      label="Valuation Calculator"
                      href="/calculators/valuation"
                    />
                  </Box>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Box sx={{ textAlign: "center", py: 10 }}>
                    <Typography
                      sx={{ fontFamily: SANS, fontSize: "1rem", color: T.ink }}
                    >
                      Enter your inputs and click Calculate to see your
                      break-even forecast.
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 3,
                        mt: 5,
                      }}
                    >
                      <Box>
                        <CLabel text="Cumulative Profit / Loss" />
                        <EmptyChart />
                      </Box>
                      <Box>
                        <CLabel text="Revenue vs Fixed Costs" />
                        <EmptyChart />
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        calculatorName="Break-Even Calculator"
        result={result}
      />
    </CalcPageLayout>
  );
}
