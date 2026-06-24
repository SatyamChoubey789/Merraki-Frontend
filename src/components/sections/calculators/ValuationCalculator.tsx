"use client";

import { useState, useMemo, useRef } from "react";
import { Box, Typography } from "@mui/material";
import {
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
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

const ACCENT = "#7C3AED";

/* ── Industry presets from Excel ─────────────────────────── */
interface IndustryPreset {
  wacc: number;
  terminal: number;
  multiple: number;
}

const INDUSTRIES: Record<string, IndustryPreset> = {
  SaaS: { wacc: 0.15, terminal: 0.04, multiple: 10 },
  "E-commerce": { wacc: 0.17, terminal: 0.03, multiple: 7 },
  Marketplace: { wacc: 0.17, terminal: 0.04, multiple: 9 },
  Fintech: { wacc: 0.18, terminal: 0.04, multiple: 10 },
  "D2C / Consumer Brands": { wacc: 0.17, terminal: 0.03, multiple: 8 },
  "Services (Agency / Consulting)": {
    wacc: 0.14,
    terminal: 0.035,
    multiple: 6,
  },
  Manufacturing: { wacc: 0.13, terminal: 0.03, multiple: 7 },
  "Healthcare / Clinics": { wacc: 0.13, terminal: 0.04, multiple: 9 },
  EdTech: { wacc: 0.17, terminal: 0.04, multiple: 8 },
  "Logistics / Delivery": { wacc: 0.15, terminal: 0.03, multiple: 7 },
  "Food & Beverage (QSR, Cloud Kitchen)": {
    wacc: 0.15,
    terminal: 0.03,
    multiple: 7,
  },
  "Restaurants / Cafes": { wacc: 0.15, terminal: 0.025, multiple: 5 },
  "Retail (Offline Stores)": { wacc: 0.15, terminal: 0.025, multiple: 5 },
  "Real Estate / Development": { wacc: 0.13, terminal: 0.03, multiple: 8 },
  "Construction / Infra": { wacc: 0.13, terminal: 0.03, multiple: 6 },
  "Energy / Utilities": { wacc: 0.11, terminal: 0.03, multiple: 8 },
  "Media / Content": { wacc: 0.15, terminal: 0.03, multiple: 7 },
  "Gaming / Apps": { wacc: 0.17, terminal: 0.04, multiple: 9 },
  Telecom: { wacc: 0.11, terminal: 0.025, multiple: 6 },
  "Automobile / EV": { wacc: 0.15, terminal: 0.03, multiple: 7 },
  "Travel / Hospitality": { wacc: 0.15, terminal: 0.03, multiple: 7 },
  "HRTech / Recruitment": { wacc: 0.15, terminal: 0.04, multiple: 8 },
  "Legal / Professional Services": { wacc: 0.14, terminal: 0.035, multiple: 7 },
  "Agriculture / AgriTech": { wacc: 0.15, terminal: 0.03, multiple: 6 },
};

const INDUSTRY_LIST = Object.keys(INDUSTRIES);


type FieldVal = number | "";

interface Params {
  annualRevenue: FieldVal;
  revenueGrowth: FieldVal;
  profitMargin: FieldVal;
  forecastYears: FieldVal;
  discountRate: FieldVal;
  terminalGrowth: FieldVal;
  industryMultiple: FieldVal;
}

function toNum(v: FieldVal): number {
  return v === "" ? 0 : v;
}

/* ── Formatter ───────────────────────────────────────────── */
function fmtV(n: number) {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/* ── Core computation ────────────────────────────────────── */
function compute(p: Params) {
  const rev = toNum(p.annualRevenue);
  const growth = toNum(p.revenueGrowth) / 100;
  const margin = toNum(p.profitMargin) / 100;
  const disc = toNum(p.discountRate) / 100;
  const tg = toNum(p.terminalGrowth) / 100;
  const mult = toNum(p.industryMultiple);
  const years = toNum(p.forecastYears);

  const forecast: any[] = [];
  let totalDCF = 0;

  for (let y = 1; y <= years; y++) {
    const revenue = rev * Math.pow(1 + growth, y);
    const ebitda = revenue * margin;
    const pv = ebitda / Math.pow(1 + disc, y);
    totalDCF += pv;
    forecast.push({
      year: `Y${y}`,
      revenue: Math.round(revenue),
      ebitda: Math.round(ebitda),
      pv: Math.round(pv),
      marginPct: toNum(p.profitMargin),
    });
  }

  const finalEbitda = rev * Math.pow(1 + growth, years) * margin;
  const tv = disc > tg ? (finalEbitda * (1 + tg)) / (disc - tg) : 0;
  const tvPV = tv / Math.pow(1 + disc, years);

  const dcf = totalDCF + tvPV;
  const comp = finalEbitda * mult;
  const blended = (dcf + comp) / 2;

  return { dcf, comp, blended, tvPV, forecast };
}


export default function ValuationCalculatorPage() {
  const [industry, setIndustry] = useState<string>("");

  const [p, setP] = useState<Params>({
    annualRevenue: "",
    revenueGrowth: "",
    profitMargin: "",
    forecastYears: "",
    discountRate: "",
    terminalGrowth: "",
    industryMultiple: "",
  });

  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof compute> | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleIndustry = (name: string) => {
    setIndustry(name);
    setResult(null);
    if (!name) return;
    const preset = INDUSTRIES[name];
    if (!preset) return;
    setP((prev) => ({
      ...prev,
      discountRate: Math.round(preset.wacc * 100 * 10) / 10,
      terminalGrowth: Math.round(preset.terminal * 100 * 10) / 10,
      industryMultiple: preset.multiple,
    }));
  };

  const set = (k: keyof Params) => (v: number | "") =>
    setP((prev) => ({ ...prev, [k]: v }));

  const discNum = toNum(p.discountRate);
  const tgNum = toNum(p.terminalGrowth);
  const invalid = discNum > 0 && tgNum >= discNum;

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
        r.year,
        fmtV(r.revenue),
        fmtV(r.ebitda),
        `${r.marginPct}%`,
        fmtV(r.pv),
      ]) ?? [],
    [result],
  );

  return (
    <CalcPageLayout
      title="Valuation & Revenue Forecast Calculator"
      description="Estimate what your business is worth. Get a quick revenue forecast & valuation using DCF — no complex models needed."
      accent={ACCENT}
      tags={["Revenue", "Valuation", "Forecast"]}
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
            {/* ── Industry selector ── */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontWeight: 500,
                  fontSize: "0.78rem",
                  color: T.inkMid,
                  mb: 0.6,
                  letterSpacing: "-0.005em",
                }}
              >
                Your Industry
              </Typography>
              <Typography
                sx={{
                  fontFamily: SANS,
                  fontSize: "0.68rem",
                  color: T.inkFaint,
                  mb: 1,
                  lineHeight: 1.4,
                }}
              >
                Select your business type — we'll auto-fill the rate fields
              </Typography>

              <Box
                component="select"
                value={industry}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleIndustry(e.target.value)
                }
                sx={{
                  width: "100%",
                  border: `1.5px solid ${industry ? ACCENT + "55" : T.border}`,
                  borderRadius: "10px",
                  px: 1.5,
                  py: 1.25,
                  fontFamily: SANS,
                  fontSize: "0.845rem",
                  fontWeight: 500,
                  color: industry ? T.ink : T.inkFaint,
                  background: industry ? `${ACCENT}06` : T.bg,
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                  "&:focus": {
                    borderColor: ACCENT,
                    boxShadow: `0 0 0 3px ${ACCENT}18`,
                  },
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%239898AE' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  pr: "36px",
                }}
              >
                <option value="">Select industry…</option>
                {INDUSTRY_LIST.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Box>

              {industry && (
                <Box
                  sx={{
                    mt: 1,
                    px: 1.25,
                    py: 0.75,
                    borderRadius: "7px",
                    background: `${ACCENT}08`,
                    border: `1px solid ${ACCENT}20`,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: ACCENT,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: SANS,
                      fontSize: "0.67rem",
                      color: ACCENT,
                      fontWeight: 500,
                    }}
                  >
                    Rate fields auto-filled for {industry}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{ height: "1px", background: T.border, mb: 2.5, mx: -2.5 }}
            />

            <CalcInput
              label="Annual Revenue"
              value={p.annualRevenue}
              onChange={set("annualRevenue")}
              prefix="₹"
              step={500000}
              helperText="Your yearly sales"
            />
            <CalcInput
              label="Revenue Growth (% per year)"
              value={p.revenueGrowth}
              onChange={set("revenueGrowth")}
              suffix="%"
              step={1}
              helperText="How fast your revenue is growing"
            />
            <CalcInput
              label="Profit Margin (%)"
              value={p.profitMargin}
              onChange={set("profitMargin")}
              suffix="%"
              step={1}
              helperText="Profit you keep from revenue"
            />
            <CalcInput
              label="Forecast Period (years)"
              value={p.forecastYears}
              onChange={set("forecastYears")}
              min={2}
              step={1}
              helperText="How many years to project"
            />

            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Box sx={{ flex: 1, height: "1px", background: T.border }} />
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: T.inkFaint,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {industry ? "Auto-filled · editable" : "Rate fields"}
                </Typography>
                <Box sx={{ flex: 1, height: "1px", background: T.border }} />
              </Box>
            </Box>

            <CalcInput
              label="Expected Return (%)"
              value={p.discountRate}
              onChange={set("discountRate")}
              suffix="%"
              step={0.5}
              helperText="Investor return expectation"
              error={invalid ? "Must exceed Long-term Growth %" : undefined}
            />
            <CalcInput
              label="Long-term Growth (%)"
              value={p.terminalGrowth}
              onChange={set("terminalGrowth")}
              suffix="%"
              step={0.5}
              helperText="Stable growth after a few years"
              error={
                invalid ? "Must be less than Expected Return %" : undefined
              }
            />
            <CalcInput
              label="Industry Multiple (x)"
              value={p.industryMultiple}
              onChange={set("industryMultiple")}
              suffix="x"
              step={0.5}
              helperText="How similar businesses are valued"
            />

            {invalid && (
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: "8px",
                  mb: 1,
                  background: "rgba(220,38,38,0.05)",
                  border: "1px solid rgba(220,38,38,0.18)",
                }}
              >
                <Typography
                  sx={{ fontFamily: SANS, fontSize: "0.72rem", color: T.red }}
                >
                  Expected Return must exceed Long-term Growth.
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
              label="DCF Valuation"
              value={result ? fmtV(result.dcf) : "—"}
              accent={ACCENT}
              highlight
            />
            <MetricCard
              label="Comparable"
              value={result ? fmtV(result.comp) : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Blended"
              value={result ? fmtV(result.blended) : "—"}
              accent={ACCENT}
            />
            <MetricCard
              label="Terminal Value (PV)"
              value={result ? fmtV(result.tvPV) : "—"}
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
              duration={3000}
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
                      <CLabel text="Revenue & Profit" />
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
                            dataKey="year"
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tickFormatter={fmtV}
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            width={60}
                          />
                          <Tooltip
                            content={<ChartTip formatVal={fmtV} />}
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <Bar
                            dataKey="revenue"
                            name="Revenue"
                            fill={`${ACCENT}20`}
                            radius={[2, 2, 0, 0]}
                            barSize={22}
                          />
                          <Line
                            type="monotone"
                            dataKey="ebitda"
                            name="Profit"
                            stroke={ACCENT}
                            strokeWidth={2}
                            dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box>
                      <CLabel text="Present Value of Cash Flows" />
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={result.forecast}
                          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="pvGrad"
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
                            dataKey="year"
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            tickFormatter={fmtV}
                            tick={AX}
                            tickLine={false}
                            axisLine={false}
                            width={60}
                          />
                          <Tooltip
                            content={<ChartTip formatVal={fmtV} />}
                            cursor={{ stroke: T.border, strokeWidth: 1 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="pv"
                            name="Present Value"
                            stroke={ACCENT}
                            strokeWidth={2}
                            fill="url(#pvGrad)"
                            dot={{ fill: ACCENT, r: 3, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  <DataTable
                    title="Revenue Forecast Table"
                    columns={[
                      "Year",
                      "Revenue",
                      "Profit",
                      "Margin",
                      "Present Value",
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
                      label="Profit Margin Calculator"
                      href="/calculators/margins"
                    />
                  </Box>
                </motion.div>
              ) : !computing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography
                      sx={{
                        fontFamily: SANS,
                        fontSize: "1rem",
                        color: T.inkMuted,
                        mb: 1,
                      }}
                    >
                      {industry
                        ? "Fill in your numbers and click Calculate."
                        : "Start by selecting your industry above."}
                    </Typography>
                    {!industry && (
                      <Typography
                        sx={{
                          fontFamily: SANS,
                          fontSize: "0.82rem",
                          color: T.inkFaint,
                        }}
                      >
                        We'll auto-fill the rate fields based on your business
                        type.
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                        gap: 3,
                        mt: 5,
                      }}
                    >
                      <Box>
                        <CLabel text="Revenue & Profit" />
                        <EmptyChart />
                      </Box>
                      <Box>
                        <CLabel text="Present Value" />
                        <EmptyChart />
                      </Box>
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
        calculatorName="Valuation Calculator"
        result={result}
      />
    </CalcPageLayout>
  );
}
