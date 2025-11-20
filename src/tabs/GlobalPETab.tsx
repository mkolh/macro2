import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { useGlobalPEData } from '../data/hooks';

export function GlobalPETab() {
  const { data, loading, error } = useGlobalPEData();

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load global political economy data.</Card>;
  if (!data) return null;

  const corePeriphery = {
    labels: data.corePeriphery.map((r) => r.region),
    datasets: [
      { label: 'GDP per capita', data: data.corePeriphery.map((r) => r.gdpPerCapita), backgroundColor: '#3b82f6', yAxisID: 'y' },
      { label: 'Commodity export share %', data: data.corePeriphery.map((r) => r.commodityShare), backgroundColor: '#f97316', yAxisID: 'y1' }
    ]
  };

  const tradeOpen = {
    labels: data.tradeOpenness.map((r) => r.region),
    datasets: [{ label: 'Trade openness % GDP', data: data.tradeOpenness.map((r) => r.openness), backgroundColor: '#22c55e' }]
  };

  const debtSocial = {
    labels: data.debtVsSocial.map((d) => d.country),
    datasets: [
      { label: 'Debt service % revenue', data: data.debtVsSocial.map((d) => d.debtService), backgroundColor: '#3b82f6' },
      { label: 'Social spending % GDP', data: data.debtVsSocial.map((d) => d.socialSpending), backgroundColor: '#a855f7' }
    ]
  };

  const fdiPortfolio = {
    labels: data.fdiFlows.map((f) => f.region),
    datasets: [
      { label: 'FDI inflows', data: data.fdiFlows.map((f) => f.fdi), backgroundColor: '#22c55e' },
      { label: 'Portfolio inflows', data: data.fdiFlows.map((f) => f.portfolio), backgroundColor: '#f97316' }
    ]
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="Core vs periphery" subtitle="Income & commodity reliance" />
        <ChartContainer
          type="bar"
          data={corePeriphery}
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
        <ExplainText>Illustrates hierarchy between high-income core and commodity-dependent periphery.</ExplainText>
      </Card>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Trade openness" subtitle="Exports + imports / GDP" />
          <ChartContainer type="bar" data={tradeOpen} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Shows different integration models.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Debt service vs social spending" subtitle="Fiscal squeeze" />
          <ChartContainer type="bar" data={debtSocial} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Debt costs can crowd out social investment.</ExplainText>
        </Card>
      </div>

      <Card>
        <CardHeader title="FDI vs portfolio flows" subtitle="Capital composition" />
        <ChartContainer type="bar" data={fdiPortfolio} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
        <ExplainText>Portfolio flows are more volatile than FDI; emerging markets manage this balance.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="Global PE" />
        <ExplainText>
          Core regions often capture high-value industries; periphery faces commodity dependence and external financing cycles that shift
          bargaining power.
        </ExplainText>
      </Card>
    </div>
  );
}
