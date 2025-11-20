export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface PairedSeriesPoint {
  x: number;
  y: number;
}

export interface MacroSnapshot {
  gdp: TimeSeriesPoint[];
  inflation: TimeSeriesPoint[];
  unemployment: TimeSeriesPoint[];
  fedFunds?: TimeSeriesPoint[];
  debtToGdp?: TimeSeriesPoint[];
}

export interface GlobalSnapshot {
  countries: Array<{
    name: string;
    gdpGrowth: number;
    inflation: number;
    debtToGdp: number;
  }>;
  countrySeries: Record<string, TimeSeriesPoint[]>;
}

export interface HistoricalDecade {
  label: string;
  avgGrowth: number;
  avgInflation: number;
}

export interface DistributionData {
  laborShare: TimeSeriesPoint[];
  profitShare: TimeSeriesPoint[];
  wagesProductivityProfit: Array<{ label: string; wage: number; productivity: number; profit: number }>;
  inequality: Array<{ group: string; incomeShare: number; wealthShare: number }>;
  unionDensity: TimeSeriesPoint[];
  minimumWage: TimeSeriesPoint[];
}

export interface InstitutionsData {
  fiscalComposition: Array<{ category: string; value: number }>;
  taxStructure: Array<{ category: string; value: number }>;
  financeProfitShare: TimeSeriesPoint[];
  lobbying: Array<{ sector: string; value: number }>;
}

export interface GlobalPEData {
  corePeriphery: Array<{ region: string; gdpPerCapita: number; commodityShare: number }>;
  tradeOpenness: Array<{ region: string; openness: number }>;
  debtVsSocial: Array<{ country: string; debtService: number; socialSpending: number }>;
  fdiFlows: Array<{ region: string; fdi: number; portfolio: number }>;
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
