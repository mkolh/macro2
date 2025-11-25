import React, { useMemo, useState } from 'react';
import { StatusChip } from './components/StatusChip';
import { Pill } from './components/Pill';
import { OverviewTab } from './tabs/OverviewTab';
import { USDetailTab } from './tabs/USDetailTab';
import { GlobalOverviewTab } from './tabs/GlobalOverviewTab';
import { HistoricalTab } from './tabs/HistoricalTab';
import { useDatasetContext } from './data/DatasetContext';
import { useMetadata } from './data/hooks';

const tabs = [
  { id: 'overview', label: 'Overview', component: <OverviewTab /> },
  { id: 'us', label: 'US Detail', component: <USDetailTab /> },
  { id: 'global', label: 'Global Overview', component: <GlobalOverviewTab /> },
  { id: 'historical', label: 'Historical (100y)', component: <HistoricalTab /> }
] as const;

type TabId = (typeof tabs)[number]['id'];

function TabButton({ id, label, active, onClick }: { id: TabId; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      key={id}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
        active ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

function MetadataPanel() {
  const { metadata, sourceLabel } = useMetadata();
  const { loadFromFile, loading, error } = useDatasetContext();

  return (
    <div className="flex flex-wrap gap-3 items-center text-sm text-slate-300">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200">Load JSON</span>
        <input
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void loadFromFile(file);
          }}
          disabled={loading}
        />
      </label>
      <StatusChip mode={sourceLabel.startsWith('Loaded') ? 'live' : 'dummy'} label={sourceLabel} />
      <div className="flex gap-2 items-center text-xs text-slate-400">
        <span>Generated: {metadata.generatedAt ?? 'n/a'}</span>
        {metadata.note && <span className="hidden sm:inline">• {metadata.note}</span>}
        {error && <span className="text-rose-300">{error}</span>}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const active = useMemo(() => tabs.find((t) => t.id === activeTab)?.component, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Macro & Political Economy Dashboard</p>
              <h1 className="text-3xl font-bold">US macro and world context from uploaded JSON.</h1>
            </div>
          </div>
          <MetadataPanel />
          <div className="flex flex-wrap gap-2">
            <Pill label="US macro" tone="accent" />
            <Pill label="Global" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <TabButton key={tab.id} id={tab.id} label={tab.label} active={tab.id === activeTab} onClick={() => setActiveTab(tab.id)} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{active}</main>
    </div>
  );
}
