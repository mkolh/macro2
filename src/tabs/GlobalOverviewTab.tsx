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

  const gridColor = '#1f2937';

  const lineData = {
    labels: data.gdpGrowth.map((p) => p.date),
    datasets: [
      { label: 'World GDP growth %', data: data.gdpGrowth.map((p) => p.value), borderColor: '#3b82f6', tension: 0.3, yAxisID: 'y' },
      { label: 'World inflation %', data: data.inflation.map((p) => p.value), borderColor: '#f97316', tension: 0.3, yAxisID: 'y1' }
    ]
  };

  const decadeData = {
    labels: data.decades.map((d) => d.label),
    datasets: [
      { label: 'Avg growth %', data: data.decades.map((d) => d.avgGrowth), backgroundColor: '#22c55e' },
      { label: 'Avg inflation %', data: data.decades.map((d) => d.avgInflation), backgroundColor: '#fbbf24' }
    ]
  };

  const lineOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: '#e5e7eb' } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: gridColor } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: gridColor }, title: { display: true, text: 'Growth %', color: '#cbd5e1' } },
      y1: {
        position: 'right',
        ticks: { color: '#9ca3af' },
        grid: { drawOnChartArea: false, color: gridColor },
        title: { display: true, text: 'Inflation %', color: '#cbd5e1' }
      }
    }
  };

  const decadeOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#e5e7eb' } } },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: gridColor } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: gridColor }, title: { display: true, text: '%', color: '#cbd5e1' } }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="World macro series" subtitle="Growth & inflation" />
        <ChartContainer type="line" data={lineData} options={lineOptions} />
        <ExplainText>World-level series supplied directly by the uploaded dataset.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="World decadal view" subtitle="Growth & inflation" />
        <ChartContainer type="bar" data={decadeData} options={decadeOptions} />
        <ExplainText>Rollups computed upstream and carried inside the JSON file.</ExplainText>
      </Card>
    </div>
  );
}
