import React, { createContext, useContext, useMemo, useState } from 'react';
import defaultDataset from './dataset.json';
import { MacroDataset } from './types';

interface DatasetContextValue {
  dataset: MacroDataset;
  loading: boolean;
  error: string | null;
  sourceLabel: string;
  loadFromFile: (file: File) => Promise<void>;
}

const DatasetContext = createContext<DatasetContextValue | null>(null);

export function DatasetProvider({ children }: { children: React.ReactNode }) {
  const [dataset, setDataset] = useState<MacroDataset>(defaultDataset as MacroDataset);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState('Default dataset');

  const loadFromFile = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as MacroDataset;
      if (!parsed || !parsed.countries || !parsed.metadata) {
        throw new Error('File missing required metadata or countries section');
      }
      setDataset(parsed);
      setSourceLabel(`Loaded ${file.name}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ dataset, loading, error, loadFromFile, sourceLabel }),
    [dataset, loading, error, sourceLabel]
  );

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
}

export function useDatasetContext(): DatasetContextValue {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('DatasetProvider missing in component tree');
  return ctx;
}
