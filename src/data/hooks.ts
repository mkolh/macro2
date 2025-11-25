import { useMemo } from 'react';
import { useDatasetContext } from './DatasetContext';
import {
  HookResult,
  USMacroSnapshot,
  WorldMacroSnapshot,
  MacroHistoricalDecade,
  MacroDataset
} from './types';

function normalizeNumber(value: number | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function buildUSMacro(dataset: MacroDataset | null): USMacroSnapshot | null {
  const country = dataset?.countries?.USA;
  if (!country) return null;
  const series = country.macro.series;
  const derived = country.macro.derived;

  return {
    gdpReal: series.gdpReal ?? [],
    inflationYoY: derived?.inflationYoY ?? [],
    cpi: series.cpi ?? [],
    unemploymentRate: series.unemploymentRate ?? [],
    fedFundsRate: series.fedFundsRate ?? [],
    debtToGdp: series.debtToGdp ?? [],
    gdpGrowthYoY: derived?.gdpGrowthYoY ?? []
  };
}

function buildWorldMacro(dataset: MacroDataset | null): WorldMacroSnapshot | null {
  const world = dataset?.countries?.WLD;
  if (!world) return null;
  const series = world.macro.series;
  const decades = world.macro.historicalView?.decades ?? [];
  return {
    gdpGrowth: series.gdpGrowth ?? [],
    inflation: series.inflation ?? [],
    decades
  };
}

export function useUSMacroData(): HookResult<USMacroSnapshot> {
  const { dataset, loading, error } = useDatasetContext();
  const data = useMemo(() => buildUSMacro(dataset), [dataset]);
  return { data, loading, error };
}

export function useGlobalMacroData(): HookResult<WorldMacroSnapshot> {
  const { dataset, loading, error } = useDatasetContext();
  const data = useMemo(() => buildWorldMacro(dataset), [dataset]);
  return { data, loading, error };
}

export function useHistoricalMacroData(countryCode: 'USA' | 'WLD' = 'USA'): HookResult<MacroHistoricalDecade[]> {
  const { dataset, loading, error } = useDatasetContext();
  const data = useMemo(() => dataset?.countries?.[countryCode]?.macro.historicalView?.decades ?? null, [dataset, countryCode]);
  return { data, loading, error };
}

export function useMetadata() {
  const { dataset, loading, error, sourceLabel } = useDatasetContext();
  return { metadata: dataset?.metadata ?? {}, loading, error, sourceLabel };
}

export { normalizeNumber };
