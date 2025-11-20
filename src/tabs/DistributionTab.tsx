import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { useDistributionData } from '../data/hooks';

export function DistributionTab() {
  const { data, loading, error } = useDistributionData();

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load distribution data.</Card>;
  if (!data) return null;

  const laborProfit = {
    labels: data.laborShare.map((p) => p.date),
    datasets: [
      { label: 'Labor share %', data: data.laborShare.map((p) => p.value), borderColor: '#3b82f6' },
      { label: 'Profit share %', data: data.profitShare.map((p) => p.value), borderColor: '#f97316' }
    ]
  };

  const wageProductivity = {
    labels: data.wagesProductivityProfit.map((p) => p.label),
    datasets: [
      { label: 'Real wage index', data: data.wagesProductivityProfit.map((p) => p.wage), borderColor: '#22c55e' },
      { label: 'Productivity index', data: data.wagesProductivityProfit.map((p) => p.productivity), borderColor: '#3b82f6' },
      { label: 'Profit per worker', data: data.wagesProductivityProfit.map((p) => p.profit), borderColor: '#a855f7' }
    ]
  };

  const inequality = {
    labels: data.inequality.map((i) => i.group),
    datasets: [
      { label: 'Income share', data: data.inequality.map((i) => i.incomeShare), backgroundColor: '#3b82f6' },
      { label: 'Wealth share', data: data.inequality.map((i) => i.wealthShare), backgroundColor: '#f97316' }
    ]
  };

  const unions = {
    labels: data.unionDensity.map((p) => p.date),
    datasets: [
      { label: 'Union density %', data: data.unionDensity.map((p) => p.value), borderColor: '#22d3ee', yAxisID: 'y' },
      { label: 'Real minimum wage index', data: data.minimumWage.map((p) => p.value), borderColor: '#a855f7', yAxisID: 'y1' }
    ]
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Labor vs profit share" subtitle="Income distribution" />
          <ChartContainer type="line" data={laborProfit} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Labor share erosion vs rising profits.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Wages vs productivity vs profit" subtitle="Indices" />
          <ChartContainer type="line" data={wageProductivity} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Shows decoupling between productivity and pay.</ExplainText>
        </Card>
      </div>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Inequality snapshot" subtitle="Income & wealth shares" />
          <ChartContainer type="bar" data={inequality} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Placeholder for WID inequality series.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Union density & minimum wage" subtitle="Institutions" />
          <ChartContainer
            type="line"
            data={unions}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#e5e7eb' } } },
              scales: {
                x: { ticks: { color: '#9ca3af' } },
                y: { ticks: { color: '#9ca3af' } },
                y1: { position: 'right', ticks: { color: '#9ca3af' }, grid: { drawOnChartArea: false } }
              }
            }}
          />
          <ExplainText>Union power and wage floors anchor bargaining outcomes.</ExplainText>
        </Card>
      </div>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="Distribution & power" />
        <ExplainText>
          Profit-led regimes lift capital incomes; wage-led regimes spread gains more evenly. Institutions like unions and minimum wages tilt
          bargaining power.
        </ExplainText>
      </Card>
    </div>
  );
}
