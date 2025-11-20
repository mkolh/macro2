import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { useHistoricalMacroData } from '../data/hooks';
import { summarizeRegimes } from '../utils/classifiers';

export function HistoricalTab() {
  const { data, loading, error } = useHistoricalMacroData();

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load history.</Card>;
  if (!data) return null;

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      { label: 'Avg growth %', data: data.map((d) => d.avgGrowth), borderColor: '#3b82f6' },
      { label: 'Avg inflation %', data: data.map((d) => d.avgInflation), borderColor: '#f97316' }
    ]
  };

  const regimeText = summarizeRegimes(data);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="Historical decadal trends" subtitle="100 years" />
        <ChartContainer type="line" data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
        <ExplainText>Decadal averages for growth and inflation.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Decadal table" subtitle="Growth & inflation" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Decade</th>
                <th className="py-2">Avg growth</th>
                <th className="py-2">Avg inflation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.map((d) => (
                <tr key={d.label}>
                  <td className="py-2 text-slate-200">{d.label}</td>
                  <td className="py-2">{d.avgGrowth}%</td>
                  <td className="py-2">{d.avgInflation}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ExplainText>{regimeText}</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="Regimes" />
        <ExplainText>
          Golden-age decades saw broad wage gains; neoliberal decades feature lower inflation but weaker labor bargaining power. Policy
          choices shape which groups bear adjustment.
        </ExplainText>
      </Card>
    </div>
  );
}
