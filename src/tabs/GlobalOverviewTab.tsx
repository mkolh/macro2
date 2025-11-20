import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { useGlobalMacroData } from '../data/hooks';

export function GlobalOverviewTab() {
  const { data, loading, error } = useGlobalMacroData();

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load global data.</Card>;
  if (!data) return null;

  const barData = {
    labels: data.countries.map((c) => c.name),
    datasets: [
      { label: 'GDP growth %', data: data.countries.map((c) => c.gdpGrowth), backgroundColor: '#3b82f6' },
      { label: 'Inflation %', data: data.countries.map((c) => c.inflation), backgroundColor: '#f97316' },
      { label: 'Debt / GDP %', data: data.countries.map((c) => c.debtToGdp), backgroundColor: '#a855f7' }
    ]
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="Global country comparison" subtitle="Growth, inflation, debt" />
        <ChartContainer type="bar" data={barData} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
        <ExplainText>Cross-country dummy comparison to swap with World Bank / IMF data.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Global table" subtitle="Macro snapshot" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Country</th>
                <th className="py-2">GDP growth</th>
                <th className="py-2">Inflation</th>
                <th className="py-2">Debt / GDP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.countries.map((c) => (
                <tr key={c.name}>
                  <td className="py-2 text-slate-200">{c.name}</td>
                  <td className="py-2">{c.gdpGrowth}%</td>
                  <td className="py-2">{c.inflation}%</td>
                  <td className="py-2">{c.debtToGdp}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ExplainText>Replace with live indicators once API keys are configured.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="Global" />
        <ExplainText>
          Commodity exporters benefit from price booms while high-debt economies feel pressure when global rates rise. Core economies often
          externalize adjustment onto more fragile periphery states.
        </ExplainText>
      </Card>
    </div>
  );
}
