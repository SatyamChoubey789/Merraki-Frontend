"use client";

import { useState, useCallback } from "react";

// ─── Breakeven Calculator ────────────────────────────────────────────────────

interface BreakevenInputs {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
}

interface BreakevenResult {
  breakevenUnits: number;
  breakevenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  isValid: boolean;
  error?: string;
}

export function useBreakevenCalculator() {
  const [inputs, setInputs] = useState<BreakevenInputs>({
    fixedCosts: 0,
    variableCostPerUnit: 0,
    sellingPricePerUnit: 0,
  });

  const result = useCallback((): BreakevenResult => {
    const { fixedCosts, variableCostPerUnit, sellingPricePerUnit } = inputs;

    if (sellingPricePerUnit <= 0) {
      return {
        breakevenUnits: 0,
        breakevenRevenue: 0,
        contributionMargin: 0,
        contributionMarginRatio: 0,
        isValid: false,
        error: "Selling price must be greater than 0",
      };
    }

    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;

    if (contributionMargin <= 0) {
      return {
        breakevenUnits: 0,
        breakevenRevenue: 0,
        contributionMargin,
        contributionMarginRatio: 0,
        isValid: false,
        error: "Selling price must be greater than variable cost",
      };
    }

    const breakevenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakevenRevenue = breakevenUnits * sellingPricePerUnit;
    const contributionMarginRatio =
      (contributionMargin / sellingPricePerUnit) * 100;

    return {
      breakevenUnits,
      breakevenRevenue,
      contributionMargin,
      contributionMarginRatio,
      isValid: true,
    };
  }, [inputs]);

  return { inputs, setInputs, result: result() };
}

// ─── Runway Calculator ───────────────────────────────────────────────────────

interface RunwayInputs {
  currentCash: number;
  monthlyBurnRate: number;
  monthlyRevenue: number;
}

interface RunwayResult {
  runwayMonths: number;
  runwayDate: Date | null;
  netBurn: number;
  isValid: boolean;
  status: "critical" | "warning" | "healthy" | "profitable";
}

export function useRunwayCalculator() {
  const [inputs, setInputs] = useState<RunwayInputs>({
    currentCash: 0,
    monthlyBurnRate: 0,
    monthlyRevenue: 0,
  });

  const result = useCallback((): RunwayResult => {
    const { currentCash, monthlyBurnRate, monthlyRevenue } = inputs;
    const netBurn = monthlyBurnRate - monthlyRevenue;

    if (netBurn <= 0) {
      return {
        runwayMonths: Infinity,
        runwayDate: null,
        netBurn,
        isValid: true,
        status: "profitable",
      };
    }

    if (currentCash <= 0) {
      return {
        runwayMonths: 0,
        runwayDate: null,
        netBurn,
        isValid: false,
        status: "critical",
      };
    }

    const runwayMonths = Math.floor(currentCash / netBurn);
    const runwayDate = new Date();
    runwayDate.setMonth(runwayDate.getMonth() + runwayMonths);

    const status =
      runwayMonths < 3 ? "critical" : runwayMonths < 6 ? "warning" : "healthy";

    return { runwayMonths, runwayDate, netBurn, isValid: true, status };
  }, [inputs]);

  return { inputs, setInputs, result: result() };
}

// ─── Profit Margin Calculator ────────────────────────────────────────────────

interface ProfitMarginInputs {
  revenue: number;
  cogs: number;
  operatingExpenses: number;
  taxes: number;
}

interface ProfitMarginResult {
  grossProfit: number;
  grossMargin: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
  netMargin: number;
  isValid: boolean;
}

export function useProfitMarginCalculator() {
  const [inputs, setInputs] = useState<ProfitMarginInputs>({
    revenue: 0,
    cogs: 0,
    operatingExpenses: 0,
    taxes: 0,
  });

  const result = useCallback((): ProfitMarginResult => {
    const { revenue, cogs, operatingExpenses, taxes } = inputs;

    if (revenue <= 0) {
      return {
        grossProfit: 0,
        grossMargin: 0,
        operatingProfit: 0,
        operatingMargin: 0,
        netProfit: 0,
        netMargin: 0,
        isValid: false,
      };
    }

    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - operatingExpenses;
    const operatingMargin = (operatingProfit / revenue) * 100;
    const netProfit = operatingProfit - taxes;
    const netMargin = (netProfit / revenue) * 100;

    return {
      grossProfit,
      grossMargin,
      operatingProfit,
      operatingMargin,
      netProfit,
      netMargin,
      isValid: true,
    };
  }, [inputs]);

  return { inputs, setInputs, result: result() };
}

// ─── Startup Valuation Calculator ───────────────────────────────────────────

interface ValuationInputs {
  annualRevenue: number;
  revenueGrowthRate: number;
  industryMultiple: number;
  ebitda: number;
  ebitdaMultiple: number;
  method: "revenue" | "ebitda" | "average";
}

interface ValuationResult {
  revenueBasedValuation: number;
  ebitdaBasedValuation: number;
  averageValuation: number;
  selectedValuation: number;
  isValid: boolean;
}

export function useValuationCalculator() {
  const [inputs, setInputs] = useState<ValuationInputs>({
    annualRevenue: 0,
    revenueGrowthRate: 0,
    industryMultiple: 5,
    ebitda: 0,
    ebitdaMultiple: 8,
    method: "average",
  });

  const result = useCallback((): ValuationResult => {
    const {
      annualRevenue,
      revenueGrowthRate,
      industryMultiple,
      ebitda,
      ebitdaMultiple,
      method,
    } = inputs;

    if (annualRevenue <= 0) {
      return {
        revenueBasedValuation: 0,
        ebitdaBasedValuation: 0,
        averageValuation: 0,
        selectedValuation: 0,
        isValid: false,
      };
    }

    const growthAdjustedMultiple =
      industryMultiple * (1 + revenueGrowthRate / 100);
    const revenueBasedValuation = annualRevenue * growthAdjustedMultiple;
    const ebitdaBasedValuation = ebitda > 0 ? ebitda * ebitdaMultiple : 0;
    const averageValuation =
      ebitdaBasedValuation > 0
        ? (revenueBasedValuation + ebitdaBasedValuation) / 2
        : revenueBasedValuation;

    const selectedValuation =
      method === "revenue"
        ? revenueBasedValuation
        : method === "ebitda"
          ? ebitdaBasedValuation
          : averageValuation;

    return {
      revenueBasedValuation,
      ebitdaBasedValuation,
      averageValuation,
      selectedValuation,
      isValid: true,
    };
  }, [inputs]);

  return { inputs, setInputs, result: result() };
}
