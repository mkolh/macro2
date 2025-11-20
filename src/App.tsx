import React, { useMemo, useState } from 'react';
import { StatusChip } from './components/StatusChip';
import { Pill } from './components/Pill';
import { OverviewTab } from './tabs/OverviewTab';
import { USDetailTab } from './tabs/USDetailTab';
import { GlobalOverviewTab } from './tabs/GlobalOverviewTab';
import { HistoricalTab } from './tabs/HistoricalTab';
import { DistributionTab } from './tabs/DistributionTab';
import { InstitutionsTab } from './tabs/InstitutionsTab';
import { GlobalPETab } from './tabs/GlobalPETab';
import { Macro101Tab } from './tabs/Macro101Tab';
import { USE_DUMMY_DATA } from './data/hooks';

const tabs = [
  { id: 'overview', label: 'Overview', component: <OverviewTab /> },
  { id: 'us', label: 'US Detail', component: <USDetailTab /> },
  { id: 'global', label: 'Global Overview', component: <GlobalOverviewTab /> },
  { id: 'historical', label: 'Historical (100y)', component: <HistoricalTab /> },
  { id: 'distribution', label: 'Distribution & Power', component: <DistributionTab /> },
  { id: 'institutions', label: 'Institutions & Policy', component: <InstitutionsTab /> },
  { id: 'global-pe', label: 'Global Political Economy', component: <GlobalPETab /> },
  { id: 'macro101', label: 'Macro 101', component: <Macro101Tab /> }
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
              <h1 className="text-3xl font-bold">US macro, global context, and who gains or loses from different regimes.</h1>
            </div>
            <StatusChip mode={USE_DUMMY_DATA ? 'dummy' : 'live'} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill label="US macro" tone="accent" />
            <Pill label="Global" />
            <Pill label="Political Economy" />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <TabButton key={tab.id} id={tab.id} label={tab.label} active={tab.id === activeTab} onClick={() => setActiveTab(tab.id)} />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {active}
      </main>
    </div>
  );
}
