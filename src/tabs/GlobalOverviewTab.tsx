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
  if (error) return <Card className="text-rose-200">Failed to load global data. Verify JSON content.</Card>;
  if (!data) return null;

  const lineData = {
    labels: data.gdpGrowth.map((p) => p.date),
    datasets: [
      { label: 'World GDP growth %', data: data.gdpGrowth.map((p) => p.value), borderColor: '#3b82f6' },
      { label: 'World inflation %', data: data.inflation.map((p) => p.value), borderColor: '#f97316' }
    ]
  };

  const decadeData = {
    labels: data.decades.map((d) => d.label),
    datasets: [
      { label: 'Avg growth %', data: data.decades.map((d) => d.avgGrowth), backgroundColor: '#22c55e' },
      { label: 'Avg inflation %', data: data.decades.map((d) => d.avgInflation), backgroundColor: '#fbbf24' }
    ]
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="World macro series" subtitle="Growth & inflation" />
        <ChartContainer
          type="line"
          data={lineData}
          options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } }, scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } } }}
        />
        <ExplainText>World-level series supplied directly by the uploaded dataset.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="World decadal view" subtitle="Growth & inflation" />
        <ChartContainer
          type="bar"
          data={decadeData}
          options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } }, scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } } }}
        />
        <ExplainText>Rollups computed upstream and carried inside the JSON file.</ExplainText>
      </Card>
    </div>
  );
}
