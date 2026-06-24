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

export interface PDFData {
  result: BreakevenResult;
  companyName: string;
}

// Profit Margin

export interface WaterfallRow {
  name: string;
  value: number;
  color: string;
}

export interface MarginRow {
  name: string;
  margin: number;
}

export interface ProfitMarginResult {
  gross: number;
  gm: number;
  opProfit: number;
  om: number;
  net: number;
  nm: number;
  taxAmt: number;
  waterfall: WaterfallRow[];
  margins: MarginRow[];
}

export interface ProfitMarginPDFData {
  result: ProfitMarginResult;
  companyName: string;
}

export type GlobalPDFData =
  | PDFData
  | ProfitMarginPDFData;