import { useEffect, useState } from 'react';
import { distributionDummy, globalMacroDummy, globalPEDummy, historicalDummy, institutionsDummy, usMacroDummy } from './dummyData';
import {
  DistributionData,
  GlobalPEData,
  GlobalSnapshot,
  HistoricalDecade,
  HookResult,
  InstitutionsData,
  MacroSnapshot,
  TimeSeriesPoint
} from './types';

const USE_DUMMY_DATA = import.meta.env?.VITE_USE_DUMMY_DATA !== 'false';

async function fetchFredSeries(seriesId: string, frequency: 'monthly' | 'quarterly'): Promise<TimeSeriesPoint[]> {
  const apiKey = import.meta.env?.VITE_FRED_API_KEY;
  if (!apiKey) throw new Error('Missing VITE_FRED_API_KEY for FRED request');

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'asc',
    frequency: frequency === 'monthly' ? 'm' : 'q'
  });
  const url = `https://api.stlouisfed.org/fred/series/observations?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FRED request failed with status ${res.status}`);
  }

  const json = (await res.json()) as { observations?: FredObservation[] };
  const observations = json.observations ?? [];

  return observations
    .filter((obs) => obs.value !== '.')
    .map((obs) => ({ date: obs.date, value: Number(obs.value) }))
    .filter((obs) => Number.isFinite(obs.value));
}

async function fetchWorldBankIndicator(countryCode: string, indicator: string): Promise<TimeSeriesPoint[]> {
  const params = new URLSearchParams({ format: 'json', per_page: '400', date: '2000:2025' });
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`World Bank request failed with status ${res.status}`);
  }

  const json = (await res.json()) as WorldBankResponse;
  const rows = json?.[1] ?? [];

  return rows
    .filter((entry) => entry.value !== null)
    .map((entry) => ({ date: `${entry.date}-01-01`, value: Number(entry.value) }))
    .reverse();
}

function yearOverYear(series: TimeSeriesPoint[], offset: number): TimeSeriesPoint[] {
  return series
    .map((point, idx) => {
      const prev = series[idx - offset];
      if (!prev || prev.value === 0) return null;
      const pct = ((point.value - prev.value) / prev.value) * 100;
      return { date: point.date, value: Number(pct.toFixed(2)) };
    })
    .filter((point): point is TimeSeriesPoint => Boolean(point));
}

function latestValue(series: TimeSeriesPoint[]): number | null {
  return series.at(-1)?.value ?? null;
}

function useDummyOrLive<T>(dummy: T, loadLive: () => Promise<T>): HookResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (USE_DUMMY_DATA) {
          setData(dummy);
        } else {
          const live = await loadLive();
          if (!cancelled) setData(live);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [dummy, loadLive]);

  return { data, loading, error };
}

export function useUSMacroData(): HookResult<MacroSnapshot> {
  return useDummyOrLive(usMacroDummy, async () => {
    const [gdpRaw, cpiRaw, unemployment, fedFunds, debtToGdp] = await Promise.all([
      fetchFredSeries('GDPC1', 'quarterly'),
      fetchFredSeries('CPIAUCSL', 'monthly'),
      fetchFredSeries('UNRATE', 'monthly'),
      fetchFredSeries('FEDFUNDS', 'monthly'),
      fetchFredSeries('GFDEGDQ188S', 'quarterly')
    ]);

    const gdp = gdpRaw.map((point) => ({ ...point, value: Number((point.value / 1000).toFixed(2)) }));
    const inflation = yearOverYear(cpiRaw, 12);

    return { gdp, inflation, unemployment, fedFunds, debtToGdp };
  });
}

export function useGlobalMacroData(): HookResult<GlobalSnapshot> {
  return useDummyOrLive(globalMacroDummy, async () => {
    const countries = [
      { code: 'USA', name: 'United States' },
      { code: 'EMU', name: 'Euro Area' },
      { code: 'JPN', name: 'Japan' },
      { code: 'CHN', name: 'China' },
      { code: 'BRA', name: 'Brazil' },
      { code: 'IND', name: 'India' }
    ];

    const [worldGrowth, worldInflation] = await Promise.all([
      fetchWorldBankIndicator('WLD', 'NY.GDP.MKTP.KD.ZG'),
      fetchWorldBankIndicator('WLD', 'FP.CPI.TOTL.ZG')
    ]);

    const countrySnapshots = await Promise.all(
      countries.map(async (country) => {
        const [gdpGrowth, inflation, debtToGdp] = await Promise.all([
          fetchWorldBankIndicator(country.code, 'NY.GDP.MKTP.KD.ZG'),
          fetchWorldBankIndicator(country.code, 'FP.CPI.TOTL.ZG'),
          fetchWorldBankIndicator(country.code, 'GC.DOD.TOTL.GD.ZS')
        ]);

        return {
          name: country.name,
          gdpGrowth: latestValue(gdpGrowth) ?? 0,
          inflation: latestValue(inflation) ?? 0,
          debtToGdp: latestValue(debtToGdp) ?? 0
        };
      })
    );

    return {
      countries: countrySnapshots,
      countrySeries: {
        'World GDP growth': worldGrowth,
        'World inflation': worldInflation
      }
    };
  });
}

export function useHistoricalMacroData(): HookResult<HistoricalDecade[]> {
  return useDummyOrLive(historicalDummy, async () => {
    const [growthSeries, inflationSeries] = await Promise.all([
      fetchWorldBankIndicator('USA', 'NY.GDP.MKTP.KD.ZG'),
      fetchWorldBankIndicator('USA', 'FP.CPI.TOTL.ZG')
    ]);

    const decades: HistoricalDecade[] = [];
    for (let startYear = 1960; startYear <= 2020; startYear += 10) {
      const endYear = startYear + 9;
      const rangeGrowth = growthSeries.filter((p) => withinRange(p.date, startYear, endYear));
      const rangeInflation = inflationSeries.filter((p) => withinRange(p.date, startYear, endYear));

      if (rangeGrowth.length === 0 || rangeInflation.length === 0) continue;

      const avgGrowth = average(rangeGrowth.map((p) => p.value));
      const avgInflation = average(rangeInflation.map((p) => p.value));
      decades.push({ label: `${startYear}–${endYear}`, avgGrowth, avgInflation });
    }

    return decades;
  });
}

export function useDistributionData(): HookResult<DistributionData> {
  return useDummyOrLive(distributionDummy, async () => {
    const laborShare = await fetchFredSeries('LABSHPUSA156NRUG', 'quarterly');
    const profitShare = laborShare.map((point) => ({ date: point.date, value: Number((100 - point.value).toFixed(2)) }));

    return {
      ...distributionDummy,
      laborShare,
      profitShare
    };
  });
}

function withinRange(date: string, startYear: number, endYear: number) {
  const year = Number(date.slice(0, 4));
  return year >= startYear && year <= endYear;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  return Number((total / values.length).toFixed(2));
}

export function useInstitutionsData(): HookResult<InstitutionsData> {
  return useDummyOrLive(institutionsDummy, async () => {
    // TODO: fetch fiscal composition from BEA/OECD, lobbying from static OpenSecrets JSON
    return institutionsDummy;
  });
}

export function useGlobalPEData(): HookResult<GlobalPEData> {
  return useDummyOrLive(globalPEDummy, async () => {
    // TODO: stitch World Bank trade stats, UNCTAD flows, commodity dependence
    return globalPEDummy;
  });
}

type WorldBankRow = { date: string; value: number | null };
type WorldBankResponse = [unknown, WorldBankRow[]];

export type FredObservation = { date: string; value: string };
export type WorldBankObservation = { date: string; value: number };
export { USE_DUMMY_DATA };
