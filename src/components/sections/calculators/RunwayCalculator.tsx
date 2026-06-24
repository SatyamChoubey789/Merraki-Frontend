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

const ACCENT = "#B45309";

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Params {
  cashBalance: number | "";
  monthlyRevenue: number | "";
  revenueGrowthRate: number | "";
  monthlyBurn: number | "";
  burnGrowthRate: number | "";
}

function compute(i: Params) {
  const cashBalance = Number(i.cashBalance) || 0;
  const monthlyRevenue = Number(i.monthlyRevenue) || 0;
  const revenueGrowthRate = Number(i.revenueGrowthRate) || 0;
  const monthlyBurn = Number(i.monthlyBurn) || 0;
  const burnGrowthRate = Number(i.burnGrowthRate) || 0;

  const netBurn = monthlyBurn - monthlyRevenue;
  const runwayMonths =
    netBurn > 0 ? Math.floor(cashBalance / netBurn) : Infinity;

  const forecast: any[] = [];
  let cash = cashBalance,
    exhausted: number | null = null;

  for (let m = 1; m <= 36; m++) {
    const rev =
      m === 1
        ? monthlyRevenue
        : forecast[m - 2].revenue * (1 + revenueGrowthRate / 100);
    const burn =
      m === 1 ? monthlyBurn : forecast[m - 2].burn * (1 + burnGrowthRate / 100);
    const net = rev - burn;
    cash += net;
    if (cash <= 0 && exhausted === null) exhausted = m;
    forecast.push({
      month: m,
      revenue: Math.round(rev),
      burn: Math.round(burn),
      net: Math.round(net),
      cashBalance: Math.max(0, Math.round(cash)),
    });
  }

  return {
    netBurn: Math.round(netBurn),
    runway: isFinite(runwayMonths) ? runwayMonths : null,
    exhausted,
    forecast,
  };
}

export default function RunwayCalculatorPage() {
  const [p, setP] = useState<Params>({
    cashBalance: "",
    monthlyRevenue: "",
    revenueGrowthRate: "",
    monthlyBurn: "",
    burnGrowthRate: "",
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

  const tableRows = useMemo(
    () =>
      result?.forecast
        .filter((_, i) => i % 3 === 0 || i < 6)
        .map((r) => [
          `Month ${r.month}`,
          fmtINR(r.revenue),
          fmtINR(r.burn),
          fmtINR(r.net),
          fmtINR(r.cashBalance),
        ]) ?? [],
    [result],
  );

  return (
    <CalcPageLayout
      title="Runway Calculator"
      description="See how long your cash will last. Track burn rate and find your runway before you run out of money."
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
              label="Current Cash Balance"
              value={p.cashBalance}
              onChange={set("cashBalance")}
              prefix="₹"
              min={0}
              step={100000}
              helperText="Total cash in the bank today"
            />
            <CalcInput
              label="Monthly Revenue"
              value={p.monthlyRevenue}
              onChange={set("monthlyRevenue")}
              prefix="₹"
              min={0}
              step={10000}
              helperText="Money you earn each month"
            />
            <CalcInput
              label="Revenue Growth (% / month)"
              value={p.revenueGrowthRate}
              onChange={set("revenueGrowthRate")}
              suffix="%"
              step={0.5}
              helperText="How much revenue grows monthly"
            />
            <CalcInput
              label="Monthly Expenses (Burn)"
              value={p.monthlyBurn}
              onChange={set("monthlyBurn")}
              min={0}
              prefix="₹"
              step={10000}
              helperText="Money you spend each month"
            />
            <CalcInput
              label="Expense Growth (% / month)"
              value={p.burnGrowthRate}
              onChange={set("burnGrowthRate")}
              suffix="%"
              step={0.5}
              helperText="How much expenses increase monthly"
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
              label="Runway"
              value={
                result
                  ? result.runway === null
                    ? "Cash +ve"
                    : `${result.runway} mo`
                  : "—"
              }
              sub={
                result?.exhausted
                  ? `Cash depleted: Month ${result.exhausted}`
                  : result
                    ? "No depletion in forecast"
                    : undefined
              }
              trend={
                result?.exhausted && result.exhausted < 12 ? "down" : "neutral"
              }
              accent={ACCENT}
              highlight
            />
            <MetricCard
              label="Net Burn / Mo"
              value={result ? fmtINR(result.netBurn) : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Cash Depleted"
              value={
                result
                  ? result.exhausted
                    ? `Month ${result.exhausted}`
                    : "Never"
                  : "—"
              }
              accent={ACCENT}
            />
            <MetricCard
              label="Starting Cash"
              value={result ? fmtINR(Number(p.cashBalance || 0)) : "—"}
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
              duration={2800}
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
                      <CLabel text="Cash Balance Over Time" />
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={result.forecast}
                          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="cashGrad"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={ACCENT}
                                stopOpacity={0.12}
                              />
                              <stop
                                offset="95%"
                                stopColor={ACCENT}
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tickFormatter={(v) => `M${v}`}
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            interval={5}
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
                          <ReferenceLine
                            y={0}
                            stroke={T.border}
                            strokeDasharray="3 3"
                          />
                          {result.exhausted && (
                            <ReferenceLine
                              x={result.exhausted}
                              stroke={T.red}
                              strokeDasharray="3 3"
                              strokeWidth={1.5}
                              label={{
                                value: `M${result.exhausted}`,
                                fill: T.red,
                                fontSize: 9,
                              }}
                            />
                          )}
                          <Area
                            type="monotone"
                            dataKey="cashBalance"
                            name="Cash Balance"
                            stroke={ACCENT}
                            strokeWidth={2}
                            fill="url(#cashGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                    <Box>
                      <CLabel text="Revenue vs Burn Rate" />
                      <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                          data={result.forecast}
                          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="2 4"
                            stroke={T.border}
                            vertical={false}
                          />
                          <XAxis
                            dataKey="month"
                            tickFormatter={(v) => `M${v}`}
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            interval={5}
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
                            dataKey="revenue"
                            name="Revenue"
                            fill={`${ACCENT}20`}
                            radius={[2, 2, 0, 0]}
                            barSize={6}
                          />
                          <Line
                            type="monotone"
                            dataKey="burn"
                            name="Burn Rate"
                            stroke={T.red}
                            strokeWidth={2}
                            dot={false}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  <DataTable
                    title="Runway Forecast (Key Months)"
                    columns={[
                      "Month",
                      "Revenue",
                      "Burn",
                      "Net",
                      "Cash Balance",
                    ]}
                    rows={tableRows}
                  />

                  {/* data-export-actions hides this row during PDF capture */}
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
                    <ExportBtn
                      onClick={() => setExportModalOpen(true)}
                      loading={false}
                    />
                    <NextCalcBtn
                      label="Break-Even Calculator"
                      href="/calculators/breakeven"
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
                      <CLabel text="Cash Balance Over Time" />
                      <EmptyChart />
                    </Box>
                    <Box>
                      <CLabel text="Revenue vs Burn Rate" />
                      <EmptyChart />
                    </Box>
                  </Box>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        calculatorName="Runway Calculator"
        result={result}
      />
    </CalcPageLayout>
  );
}
