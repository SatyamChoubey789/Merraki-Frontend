"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { colorTokens } from "@/theme";
import { CalcLayout } from "./CalcLayout";
import { CalcInput } from "./CalcInput";
import { MetricCard } from "./MetricCard";

const ACCENT = "#8B5CF6";

// ── All industries from your Industries sheet ────────────────────────────────
const INDUSTRIES: { label: string; multiple: number }[] = [
  { label: "Healthcare Services & Facilities", multiple: 12.5 },
  { label: "Pharmaceuticals & Biotechnology", multiple: 15.0 },
  { label: "Medical Devices & Equipment", multiple: 11.0 },
  { label: "Health Insurance & Managed Care", multiple: 11.5 },
  { label: "Software & SaaS", multiple: 10.6 },
  { label: "IT Services & Consulting", multiple: 9.7 },
  { label: "Internet & Online Services", multiple: 9.5 },
  { label: "Hardware, Electronics & Devices", multiple: 12.0 },
  { label: "Semiconductors & Components", multiple: 16.0 },
  { label: "Banks & Lending", multiple: 10.5 },
  { label: "Insurance (Life, P&C, Brokers)", multiple: 8.5 },
  { label: "Investment Management & Funds", multiple: 8.9 },
  { label: "Investment Banking & Brokerage", multiple: 7.4 },
  { label: "Financial Market Infrastructure & Exchanges", multiple: 8.5 },
  { label: "Industrials & Manufacturing", multiple: 12.0 },
  { label: "Aerospace & Defense", multiple: 15.3 },
  { label: "Automotive & Auto Parts", multiple: 11.5 },
  { label: "Transportation & Logistics", multiple: 13.0 },
  { label: "Metals, Mining & Materials", multiple: 9.0 },
  { label: "Chemicals (Specialty & Commodity)", multiple: 17.0 },
  { label: "Construction Materials", multiple: 10.7 },
  { label: "Paper, Packaging & Forest Products", multiple: 12.0 },
  { label: "Real Estate Development & Operations", multiple: 27.6 },
  { label: "REITs (All Types)", multiple: 19.5 },
  { label: "Real Estate Services", multiple: 7.6 },
  { label: "Infrastructure (Roads, Rail, Airports, Ports)", multiple: 12.0 },
  { label: "Oil & Gas (Upstream, Midstream, Services)", multiple: 9.5 },
  { label: "Power & Utilities", multiple: 17.5 },
  { label: "Renewable Energy & Equipment", multiple: 21.2 },
  { label: "Water & Waste Utilities", multiple: 18.3 },
  { label: "Consumer & Retail (Apparel, Home, Electronics)", multiple: 14.0 },
  { label: "Food Processing & Packaged Foods", multiple: 10.3 },
  { label: "Restaurants, Bars & QSR", multiple: 17.1 },
  { label: "Beverages (Alcoholic & Non-Alcoholic)", multiple: 12.0 },
  { label: "Media, Advertising & Entertainment", multiple: 9.0 },
  { label: "Travel, Leisure & Hospitality", multiple: 11.0 },
  { label: "Business & Professional Services", multiple: 9.5 },
  { label: "Consumer Products (Household, Personal, Toys)", multiple: 9.7 },
  { label: "Agriculture & Natural Resources", multiple: 6.8 },
  { label: "Telecommunications", multiple: 11.8 },
  { label: "Logistics & Supply Chain", multiple: 13.4 },
];

// Risk factors from sheet: Low=0.85 disc=12%, Medium=1.0 (no discount used in formula)...
// Your formula: ExitVal = F37 * industryMultiple * riskFactor
// riskFactor: Low=1.0, Medium=0.85, High=0.70
// discountRate: Low=12, Medium=15, High=18
const RISK_CONFIG = {
  Low: { factor: 1.0, discountRate: 12 },
  Medium: { factor: 0.85, discountRate: 15 },
  High: { factor: 0.7, discountRate: 18 },
};

type RiskLevel = "Low" | "Medium" | "High";

// ── Exact formula from Valuation 5Y (PV) sheet ───────────────────────────────
function computeValuation(inputs: {
  currentCustomers: number;
  newCustomersPerMonth: number;
  customerGrowthRate: number; // % e.g. 0.5
  churnRate: number; // % e.g. 0.5
  avgOrderValue: number; // ₹ per customer per year
  priceGrowthRate: number; // % per year e.g. 0.5
  initialFixedCost: number;
  ebitdaMargin: number; // fraction e.g. 0.8
  industry: string;
  riskLevel: RiskLevel;
}) {
  const {
    currentCustomers,
    newCustomersPerMonth,
    customerGrowthRate,
    churnRate,
    avgOrderValue,
    priceGrowthRate,
    initialFixedCost,
    ebitdaMargin,
    industry,
    riskLevel,
  } = inputs;

  const industryData =
    INDUSTRIES.find((i) => i.label === industry) ?? INDUSTRIES[13];
  const industryMultiple = industryData.multiple;
  const riskFactor = RISK_CONFIG[riskLevel].factor;
  const discountRate = RISK_CONFIG[riskLevel].discountRate;

  const years: {
    year: number;
    customers: number;
    price: number;
    revenue: number;
    expenses: number;
    ebitda: number;
  }[] = [];

  for (let y = 1; y <= 5; y++) {
    // Customers formula: ROUNDUP((prev + newPerMonth*12*(1+growthRate)) - (churnRate * prev))
    const prevCustomers = y === 1 ? currentCustomers : years[y - 2].customers;
    const growthMultiplier = y === 1 ? 1 : 1 + customerGrowthRate / 100;
    const newCustomers = newCustomersPerMonth * 12 * growthMultiplier;
    const customers = Math.ceil(
      prevCustomers + newCustomers - (churnRate / 100) * prevCustomers,
    );

    // Price
    const prevPrice = y === 1 ? avgOrderValue : years[y - 2].price;
    const price =
      y === 1 ? avgOrderValue : prevPrice * (1 + priceGrowthRate / 100);

    // Revenue = customers * price
    const revenue = customers * price;

    // EBITDA = ebitdaMargin * revenue
    const ebitda = ebitdaMargin * revenue;

    // Expenses = revenue - ebitda
    const expenses = revenue - ebitda;

    years.push({ year: y, customers, price, revenue, expenses, ebitda });
  }

  const year5EBITDA = years[4].ebitda;

  // Exit Valuation (Year 5, Risk-Adjusted) = F37 * industryMultiple * riskFactor
  const exitValuation = year5EBITDA * industryMultiple * riskFactor;

  // Present Value = exitValuation / ((1 + discountRate/100) ^ 5)
  const presentValue = exitValuation / Math.pow(1 + discountRate / 100, 5);

  // Breakeven year: when cumulative EBITDA > initialFixedCost
  let breakevenYear: number | null = null;
  let cumEbitda = 0;
  for (const yr of years) {
    cumEbitda += yr.ebitda;
    if (cumEbitda > initialFixedCost && breakevenYear === null) {
      breakevenYear = yr.year;
    }
  }

  // Units to sell at breakeven: initialFixedCost / avgOrderValue
  const unitsToBReakeven =
    avgOrderValue > 0 ? Math.ceil(initialFixedCost / avgOrderValue) : 0;

  return {
    years,
    exitValuation,
    presentValue,
    industryMultiple,
    discountRate,
    riskFactor,
    breakevenYear,
    unitsToBReakeven,
  };
}

function fmtCr(n: number): string {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

const YEAR_COLORS = [
  colorTokens.financeBlue[400],
  colorTokens.financeBlue[500],
  "#8B5CF6",
  colorTokens.success.main,
  colorTokens.warning.main,
];

export function ValuationCalculator() {
  const [industry, setIndustry] = useState(
    "Financial Market Infrastructure & Exchanges",
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("Medium");
  const [inputs, setInputs] = useState({
    currentCustomers: 15,
    newCustomersPerMonth: 1,
    customerGrowthRate: 0.5,
    churnRate: 0.5,
    avgOrderValue: 50000,
    priceGrowthRate: 0.5,
    initialFixedCost: 600000,
    ebitdaMargin: 80,
  });

  const set = (key: keyof typeof inputs) => (v: number) =>
    setInputs((p) => ({ ...p, [key]: v }));

  const result = useMemo(
    () =>
      computeValuation({
        ...inputs,
        ebitdaMargin: inputs.ebitdaMargin / 100,
        industry,
        riskLevel,
      }),
    [inputs, industry, riskLevel],
  );

  const revenueData = result.years.map((y) => ({
    name: `Year ${y.year}`,
    Revenue: Math.round(y.revenue),
    EBITDA: Math.round(y.ebitda),
    Customers: y.customers,
  }));

  return (
    <CalcLayout
      title="Startup Valuation Calculator (5-Year)"
      description="5-year revenue & EBITDA forecast with present value of exit — powered by real industry EBITDA multiples across 41 sectors."
      accent={ACCENT}
      inputsPanel={
        <Box>
          {/* Industry Selector */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colorTokens.darkNavy[800],
                mb: 0.75,
                fontFamily: "var(--font-display)",
              }}
            >
              Industry
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                sx={{ borderRadius: "10px" }}
              >
                {INDUSTRIES.map((ind) => (
                  <MenuItem key={ind.label} value={ind.label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: "0.8125rem" }}
                      >
                        {ind.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}
                      >
                        {ind.multiple}x
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              variant="caption"
              sx={{ color: colorTokens.slate[400], mt: 0.5, display: "block" }}
            >
              EBITDA Multiple:{" "}
              <strong style={{ color: ACCENT }}>
                {result.industryMultiple}x
              </strong>
            </Typography>
          </Box>

          {/* Risk Level */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: colorTokens.darkNavy[800],
                mb: 0.75,
                fontFamily: "var(--font-display)",
              }}
            >
              Risk Level
            </Typography>
            <ToggleButtonGroup
              value={riskLevel}
              exclusive
              onChange={(_, v) => v && setRiskLevel(v)}
              fullWidth
              size="small"
            >
              {(["Low", "Medium", "High"] as RiskLevel[]).map((r) => (
                <ToggleButton
                  key={r}
                  value={r}
                  sx={{
                    fontWeight: 700,
                    borderRadius: "10px !important",
                    fontFamily: "var(--font-display)",
                    fontSize: "0.8125rem",
                    "&.Mui-selected": {
                      backgroundColor:
                        r === "Low"
                          ? colorTokens.success.main
                          : r === "Medium"
                            ? colorTokens.warning.main
                            : colorTokens.error.main,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor:
                          r === "Low"
                            ? colorTokens.success.dark
                            : r === "Medium"
                              ? "#D97706"
                              : colorTokens.error.dark,
                      },
                    },
                  }}
                >
                  {r}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography
              variant="caption"
              sx={{ color: colorTokens.slate[400], mt: 0.5, display: "block" }}
            >
              Discount rate: <strong>{result.discountRate}%</strong> · Risk
              factor: <strong>{result.riskFactor}x</strong>
            </Typography>
          </Box>

          <CalcInput
            label="Current Customers"
            value={inputs.currentCustomers}
            onChange={set("currentCustomers")}
            step={1}
          />
          <CalcInput
            label="New Customers / Month"
            value={inputs.newCustomersPerMonth}
            onChange={set("newCustomersPerMonth")}
            step={1}
          />
          <CalcInput
            label="Customer Growth Rate (%)"
            value={inputs.customerGrowthRate}
            onChange={set("customerGrowthRate")}
            suffix="%"
            step={0.1}
            helperText="Monthly growth in new customer acquisition"
          />
          <CalcInput
            label="Churn Rate (% / year)"
            value={inputs.churnRate}
            onChange={set("churnRate")}
            suffix="%"
            step={0.1}
          />
          <CalcInput
            label="Avg Order Value / Customer (₹)"
            value={inputs.avgOrderValue}
            onChange={set("avgOrderValue")}
            prefix="₹"
            step={1000}
          />
          <CalcInput
            label="Price Growth Rate (% / year)"
            value={inputs.priceGrowthRate}
            onChange={set("priceGrowthRate")}
            suffix="%"
            step={0.1}
          />
          <CalcInput
            label="Initial Fixed Cost (₹)"
            value={inputs.initialFixedCost}
            onChange={set("initialFixedCost")}
            prefix="₹"
            step={10000}
            helperText="Capital, machinery, setup costs"
          />
          <CalcInput
            label="EBITDA Margin (%)"
            value={inputs.ebitdaMargin}
            onChange={set("ebitdaMargin")}
            suffix="%"
            step={1}
            min={0}
            helperText="% of revenue retained after costs"
          />
        </Box>
      }
      resultsPanel={
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Exit Valuation (Y5)"
              value={fmtCr(result.exitValuation)}
              subValue={`${result.industryMultiple}x × ${result.riskFactor} risk adj.`}
              accent={ACCENT}
              bg="#F5F3FF"
              icon="🚀"
              highlight
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Present Value Today"
              value={fmtCr(result.presentValue)}
              subValue={`Discounted at ${result.discountRate}% over 5Y`}
              accent={ACCENT}
              bg="#F5F3FF"
              icon="💎"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Year 5 Revenue"
              value={fmtCr(result.years[4].revenue)}
              subValue={`${result.years[4].customers.toLocaleString()} customers`}
              accent={colorTokens.success.main}
              bg={colorTokens.success.light}
              icon="📈"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <MetricCard
              label="Breakeven Year"
              value={
                result.breakevenYear
                  ? `Year ${result.breakevenYear}`
                  : "Beyond Y5"
              }
              subValue={`${result.unitsToBReakeven.toLocaleString()} units total`}
              accent={colorTokens.warning.main}
              bg={colorTokens.warning.light}
              icon="🎯"
            />
          </Grid>
        </Grid>
      }
      chartsPanel={
        <Box>
          {/* 5Y Revenue & EBITDA */}
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mb: 2 }}
          >
            5-Year Revenue & EBITDA Forecast
          </Typography>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={revenueData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colorTokens.slate[100]}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: colorTokens.slate[500], fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmtCr(v)}
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                formatter={(v?: number, name?: string) => [
                  fmtCr(v ?? 0),
                  name ?? "",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colorTokens.slate[200]}`,
                  fontFamily: "var(--font-body)",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                }}
              />
              <Bar
                dataKey="Revenue"
                fill={`${ACCENT}55`}
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
              <Bar
                dataKey="EBITDA"
                fill={ACCENT}
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Customer Growth */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: colorTokens.darkNavy[800],
              mt: 4,
              mb: 2,
            }}
          >
            5-Year Customer Growth
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={revenueData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colorTokens.slate[100]}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: colorTokens.slate[500], fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: colorTokens.slate[400], fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colorTokens.slate[200]}`,
                  fontFamily: "var(--font-body)",
                }}
              />
              <Line
                type="monotone"
                dataKey="Customers"
                stroke={colorTokens.success.main}
                strokeWidth={2.5}
                dot={{ r: 5, fill: colorTokens.success.main, strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Year-by-year table */}
          <Box sx={{ mt: 4, overflowX: "auto" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: colorTokens.darkNavy[800], mb: 2 }}
            >
              Year-by-Year Forecast
            </Typography>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8125rem",
                fontFamily: "var(--font-body)",
              }}
            >
              <Box component="thead">
                <Box
                  component="tr"
                  sx={{ backgroundColor: colorTokens.slate[50] }}
                >
                  {["Year", "Customers", "Price (₹)", "Revenue", "EBITDA"].map(
                    (h) => (
                      <Box
                        component="th"
                        key={h}
                        sx={{
                          p: "10px 14px",
                          textAlign: "left",
                          fontWeight: 700,
                          color: colorTokens.slate[600],
                          fontSize: "0.75rem",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          borderBottom: `2px solid ${colorTokens.slate[200]}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </Box>
                    ),
                  )}
                </Box>
              </Box>
              <Box component="tbody">
                {result.years.map((y, i) => (
                  <Box
                    component="tr"
                    key={y.year}
                    sx={{
                      backgroundColor:
                        i % 2 === 0 ? colorTokens.white : colorTokens.slate[50],
                      "&:hover": { backgroundColor: "#F5F3FF" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    <Box
                      component="td"
                      sx={{ p: "10px 14px", fontWeight: 700, color: ACCENT }}
                    >
                      Year {y.year}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "10px 14px",
                        fontWeight: 600,
                        color: colorTokens.darkNavy[800],
                      }}
                    >
                      {y.customers.toLocaleString("en-IN")}
                    </Box>
                    <Box
                      component="td"
                      sx={{ p: "10px 14px", color: colorTokens.slate[600] }}
                    >
                      ₹{Math.round(y.price).toLocaleString("en-IN")}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "10px 14px",
                        fontWeight: 600,
                        color: colorTokens.financeBlue[600],
                      }}
                    >
                      {fmtCr(y.revenue)}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        p: "10px 14px",
                        fontWeight: 700,
                        color: colorTokens.success.main,
                      }}
                    >
                      {fmtCr(y.ebitda)}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      }
    />
  );
}
