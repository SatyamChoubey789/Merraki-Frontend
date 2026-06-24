
export interface ForecastRow {
  month: number;
  units: number;
  revenue: number;
  varCost: number;
  fixedCost: number;
  profit: number;
  cumulativeProfit: number;
}

export interface BreakevenResult {
  bem: number | null;
  beu: number | null;
  ber: number | null;
  cm: number;
  forecast: ForecastRow[];
}

// ── Valuation ──────────────────────────────────────────────
export interface ValuationForecastRow {
  year: string;
  revenue: number;
  ebitda: number;
  pv: number;
  marginPct: number;
}
 
export interface ValuationResult {
  dcf: number;
  comp: number;
  blended: number;
  tvPV: number;
  forecast: ValuationForecastRow[];
}

export interface PDFData {
  result: BreakevenResult;
  companyName: string;
}