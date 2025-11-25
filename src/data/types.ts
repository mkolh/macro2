export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface MacroDerived {
  inflationYoY?: TimeSeriesPoint[];
  gdpGrowthYoY?: TimeSeriesPoint[];
  inflationYoYAnnual?: TimeSeriesPoint[];
  gdpGrowthYoYAnnual?: TimeSeriesPoint[];
}

export interface MacroSeries {
  gdpReal?: TimeSeriesPoint[];
  cpi?: TimeSeriesPoint[];
  unemploymentRate?: TimeSeriesPoint[];
  fedFundsRate?: TimeSeriesPoint[];
  debtToGdp?: TimeSeriesPoint[];
  gdpGrowth?: TimeSeriesPoint[];
  inflation?: TimeSeriesPoint[];
}

export interface MacroHistoricalDecade {
  label: string;
  startYear: number;
  endYear: number;
  avgGrowth: number;
  avgInflation: number;
}

export interface CountryMacro {
  series: MacroSeries;
  derived?: MacroDerived;
  historicalView?: { decades: MacroHistoricalDecade[] };
}

export interface CountryData {
  name: string;
  macro: CountryMacro;
}

export interface MacroDataset {
  metadata: Record<string, string>;
  countries: Record<string, CountryData>;
}

export interface HookResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface USBulletPoints {
  growth: string;
  laborMarket: string;
  inflation: string;
}

export interface USMacroSnapshot {
  gdpReal: TimeSeriesPoint[];
  inflationYoY: TimeSeriesPoint[];
  cpi: TimeSeriesPoint[];
  unemploymentRate: TimeSeriesPoint[];
  fedFundsRate: TimeSeriesPoint[];
  debtToGdp: TimeSeriesPoint[];
  gdpGrowthYoY: TimeSeriesPoint[];
}

export interface WorldMacroSnapshot {
  gdpGrowth: TimeSeriesPoint[];
  inflation: TimeSeriesPoint[];
  decades: MacroHistoricalDecade[];
}
