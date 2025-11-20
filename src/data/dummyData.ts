import { DistributionData, GlobalPEData, GlobalSnapshot, HistoricalDecade, MacroSnapshot } from './types';

const years = Array.from({ length: 10 }, (_, i) => 2015 + i);

function seriesFromBase(base: number, step: number): { date: string; value: number }[] {
  return years.map((year, idx) => ({ date: `${year}-01-01`, value: base + step * idx }));
}

export const usMacroDummy: MacroSnapshot = {
  gdp: seriesFromBase(19, 0.6),
  inflation: seriesFromBase(1.8, 0.2).map((p, idx) => ({ ...p, value: 1.8 + Math.sin(idx) })),
  unemployment: seriesFromBase(6, -0.3).map((p) => ({ ...p, value: Math.max(3.5, p.value) })),
  fedFunds: seriesFromBase(0.5, 0.25).map((p, idx) => ({ ...p, value: Math.max(0.25, Math.sin(idx) * 1.5 + 1) })),
  debtToGdp: seriesFromBase(95, 1.5)
};

export const globalMacroDummy: GlobalSnapshot = {
  countries: [
    { name: 'United States', gdpGrowth: 2.5, inflation: 3.1, debtToGdp: 98 },
    { name: 'Euro Area', gdpGrowth: 1.7, inflation: 2.4, debtToGdp: 88 },
    { name: 'Japan', gdpGrowth: 1.2, inflation: 1.6, debtToGdp: 220 },
    { name: 'China', gdpGrowth: 4.8, inflation: 2.1, debtToGdp: 65 },
    { name: 'Brazil', gdpGrowth: 2.2, inflation: 4.3, debtToGdp: 78 },
    { name: 'India', gdpGrowth: 6.1, inflation: 4.5, debtToGdp: 70 }
  ],
  countrySeries: {
    World: years.map((year, idx) => ({ date: `${year}-01-01`, value: 2 + Math.sin(idx) })),
    Inflation: years.map((year, idx) => ({ date: `${year}-01-01`, value: 3 + Math.cos(idx) }))
  }
};

export const historicalDummy: HistoricalDecade[] = [
  { label: '1925–1934', avgGrowth: 1.2, avgInflation: -0.5 },
  { label: '1935–1944', avgGrowth: 3.8, avgInflation: 5.1 },
  { label: '1945–1954', avgGrowth: 4.2, avgInflation: 2.5 },
  { label: '1955–1964', avgGrowth: 4.1, avgInflation: 1.8 },
  { label: '1965–1974', avgGrowth: 3.3, avgInflation: 4.5 },
  { label: '1975–1984', avgGrowth: 2.6, avgInflation: 6.8 },
  { label: '1985–1994', avgGrowth: 3.4, avgInflation: 3.2 },
  { label: '1995–2004', avgGrowth: 3.1, avgInflation: 2.6 },
  { label: '2005–2014', avgGrowth: 1.8, avgInflation: 2.4 },
  { label: '2015–2024', avgGrowth: 2.2, avgInflation: 2.8 }
];

export const distributionDummy: DistributionData = {
  laborShare: years.map((year, idx) => ({ date: `${year}-01-01`, value: 62 - idx * 0.2 })),
  profitShare: years.map((year, idx) => ({ date: `${year}-01-01`, value: 38 + idx * 0.2 })),
  wagesProductivityProfit: [
    { label: '2000', wage: 100, productivity: 100, profit: 100 },
    { label: '2005', wage: 104, productivity: 110, profit: 120 },
    { label: '2010', wage: 108, productivity: 120, profit: 135 },
    { label: '2015', wage: 112, productivity: 130, profit: 150 },
    { label: '2020', wage: 118, productivity: 140, profit: 170 },
    { label: '2024', wage: 121, productivity: 146, profit: 182 }
  ],
  inequality: [
    { group: 'Top 1%', incomeShare: 18, wealthShare: 32 },
    { group: 'Next 9%', incomeShare: 24, wealthShare: 32 },
    { group: 'Middle 40%', incomeShare: 38, wealthShare: 28 },
    { group: 'Bottom 50%', incomeShare: 20, wealthShare: 8 }
  ],
  unionDensity: years.map((year, idx) => ({ date: `${year}-01-01`, value: 11 - idx * 0.3 })),
  minimumWage: years.map((year, idx) => ({ date: `${year}-01-01`, value: 100 + idx * 2 }))
};

export const institutionsDummy = {
  fiscalComposition: [
    { category: 'Social', value: 12 },
    { category: 'Defense', value: 5 },
    { category: 'Infrastructure', value: 3 },
    { category: 'Interest', value: 2.5 }
  ],
  taxStructure: [
    { category: 'Income', value: 45 },
    { category: 'Payroll', value: 30 },
    { category: 'Consumption', value: 15 },
    { category: 'Corporate', value: 10 }
  ],
  financeProfitShare: years.map((year, idx) => ({ date: `${year}-01-01`, value: 20 + Math.sin(idx) * 2 })),
  lobbying: [
    { sector: 'Finance', value: 3.2 },
    { sector: 'Health', value: 2.8 },
    { sector: 'Tech', value: 1.9 },
    { sector: 'Energy', value: 1.6 },
    { sector: 'Other', value: 2.1 }
  ]
};

export const globalPEDummy: GlobalPEData = {
  corePeriphery: [
    { region: 'High-income core', gdpPerCapita: 62000, commodityShare: 12 },
    { region: 'Emerging semi-periphery', gdpPerCapita: 18000, commodityShare: 28 },
    { region: 'Low-income periphery', gdpPerCapita: 6500, commodityShare: 52 }
  ],
  tradeOpenness: [
    { region: 'United States', openness: 27 },
    { region: 'Euro Area', openness: 75 },
    { region: 'China', openness: 38 },
    { region: 'Small open economy', openness: 98 }
  ],
  debtVsSocial: [
    { country: 'Country A', debtService: 18, socialSpending: 12 },
    { country: 'Country B', debtService: 24, socialSpending: 9 },
    { country: 'Country C', debtService: 12, socialSpending: 15 }
  ],
  fdiFlows: [
    { region: 'Core', fdi: 620, portfolio: 780 },
    { region: 'Emerging', fdi: 410, portfolio: 220 },
    { region: 'Periphery', fdi: 140, portfolio: 60 }
  ]
};

export const macro101Cards = [
  { title: 'GDP', content: 'Gross Domestic Product measures the value of goods and services produced. Real GDP adjusts for inflation.' },
  { title: 'Inflation', content: 'Inflation tracks how fast prices are rising. Central banks target stable, low inflation to anchor expectations.' },
  { title: 'Unemployment', content: 'The unemployment rate shows the share of workers seeking jobs. It lags the business cycle.' },
  { title: 'Interest rates', content: 'Policy rates influence borrowing costs and credit. Higher rates cool demand; lower rates stimulate.' },
  { title: 'Political economy lens', content: 'Macroeconomic outcomes are shaped by institutions, bargaining power, and distributional coalitions.' },
  { title: 'How to read this dashboard', content: 'Each tab organizes data by theme, pairing charts with short annotations about who may gain or lose.' }
];
