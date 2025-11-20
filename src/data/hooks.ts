import { useEffect, useState } from 'react';
import { distributionDummy, globalMacroDummy, globalPEDummy, historicalDummy, institutionsDummy, usMacroDummy } from './dummyData';
import {
  DistributionData,
  GlobalPEData,
  GlobalSnapshot,
  HistoricalDecade,
  HookResult,
  InstitutionsData,
  MacroSnapshot
} from './types';

const USE_DUMMY_DATA = import.meta.env?.VITE_USE_DUMMY_DATA !== 'false';

async function fetchFredSeries(seriesId: string, frequency: 'monthly' | 'quarterly') {
  // TODO: implement real FRED fetch with api key
  // const apiKey = import.meta.env.VITE_FRED_API_KEY;
  // const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json`;
  // const res = await fetch(url);
  // const json = await res.json();
  // return json.observations as FredObservation[];
  return { seriesId, frequency } as unknown;
}

async function fetchWorldBankIndicator(countryCode: string, indicator: string) {
  // TODO: implement World Bank indicator fetch
  // const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json`;
  // const res = await fetch(url);
  // const json = await res.json();
  return { countryCode, indicator } as unknown;
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
    // Example of how to stitch series from FRED or BEA when USE_DUMMY_DATA=false
    // const gdp = await fetchFredSeries('GDPC1', 'quarterly');
    // const inflation = await fetchFredSeries('CPIAUCSL', 'monthly');
    // const unemployment = await fetchFredSeries('UNRATE', 'monthly');
    // const fedFunds = await fetchFredSeries('FEDFUNDS', 'monthly');
    // const debt = await fetchFredSeries('GFDEGDQ188S', 'quarterly');
    // TODO: transform responses into MacroSnapshot shape
    return usMacroDummy;
  });
}

export function useGlobalMacroData(): HookResult<GlobalSnapshot> {
  return useDummyOrLive(globalMacroDummy, async () => {
    // TODO: fetch country list from World Bank indicators
    // await fetchWorldBankIndicator('USA', 'NY.GDP.MKTP.KD.ZG');
    return globalMacroDummy;
  });
}

export function useHistoricalMacroData(): HookResult<HistoricalDecade[]> {
  return useDummyOrLive(historicalDummy, async () => {
    // TODO: compute decadal averages from long-run series
    return historicalDummy;
  });
}

export function useDistributionData(): HookResult<DistributionData> {
  return useDummyOrLive(distributionDummy, async () => {
    // TODO: fetch labor share from BEA, inequality from WID, union density from OECD/ILOSTAT
    return distributionDummy;
  });
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

export type FredObservation = { date: string; value: string };
export type WorldBankObservation = { date: string; value: number };
export { USE_DUMMY_DATA };
