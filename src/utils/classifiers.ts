import { HistoricalDecade, USBulletPoints } from '../data/types';

export function classifyCycle(growth: number, inflation: number, unemployment: number): 'near-trend' | 'cooling' | 'overheating' {
  if (growth > 3 && inflation > 3 && unemployment < 4) return 'overheating';
  if (growth < 1.5 || unemployment > 6) return 'cooling';
  return 'near-trend';
}

export function describeCycle(growth: number, inflation: number, unemployment: number): USBulletPoints {
  return {
    growth: growth > 3 ? 'Growth above trend' : growth < 1.5 ? 'Growth below trend' : 'Growth near potential',
    laborMarket: unemployment < 4 ? 'Tight labor market' : unemployment > 6 ? 'Slack labor market' : 'Balanced labor market',
    inflation: inflation > 3 ? 'Inflation above target' : inflation < 1 ? 'Inflation below target' : 'Inflation near target'
  };
}

export function summarizeRegimes(decades: HistoricalDecade[]): string {
  const pre1980 = decades.filter((d) => d.label < '1980');
  const post1980 = decades.filter((d) => d.label >= '1980');
  const avg = (arr: HistoricalDecade[]) =>
    arr.reduce(
      (acc, d) => ({ growth: acc.growth + d.avgGrowth, inflation: acc.inflation + d.avgInflation }),
      { growth: 0, inflation: 0 }
    );

  const pre = avg(pre1980);
  const post = avg(post1980);

  const preGrowth = pre.growth / pre1980.length;
  const postGrowth = post.growth / post1980.length;
  const preInfl = pre.inflation / pre1980.length;
  const postInfl = post.inflation / post1980.length;

  return `Pre-1980: growth ${preGrowth.toFixed(1)}% with inflation ${preInfl.toFixed(1)}%. Post-1980: growth ${postGrowth.toFixed(
    1
  )}% with inflation ${postInfl.toFixed(1)}%.`;
}
