import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { useInstitutionsData } from '../data/hooks';

export function InstitutionsTab() {
  const { data, loading, error } = useInstitutionsData();

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load institutional data.</Card>;
  if (!data) return null;

  const fiscal = {
    labels: data.fiscalComposition.map((f) => f.category),
    datasets: [{ label: '% of GDP', data: data.fiscalComposition.map((f) => f.value), backgroundColor: '#3b82f6' }]
  };

  const taxes = {
    labels: data.taxStructure.map((t) => t.category),
    datasets: [{ label: '% of revenue', data: data.taxStructure.map((t) => t.value), backgroundColor: '#a855f7' }]
  };

  const financeProfits = {
    labels: data.financeProfitShare.map((p) => p.date),
    datasets: [{ label: 'Finance profit share %', data: data.financeProfitShare.map((p) => p.value), borderColor: '#f97316' }]
  };

  const lobbying = {
    labels: data.lobbying.map((l) => l.sector),
    datasets: [{ label: 'Lobbying $bn', data: data.lobbying.map((l) => l.value), backgroundColor: '#22c55e' }]
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="US fiscal composition" subtitle="Spending mix" />
          <ChartContainer type="bar" data={fiscal} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Where public budgets flow.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Tax structure" subtitle="Revenue mix" />
          <ChartContainer type="bar" data={taxes} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Balance of income, payroll, consumption, and corporate taxes.</ExplainText>
        </Card>
      </div>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Finance profit share" subtitle="Corporate profits" />
          <ChartContainer type="line" data={financeProfits} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Tracks how finance captures corporate profit pools.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Lobbying by sector" subtitle="OpenSecrets placeholder" />
          <ChartContainer type="bar" data={lobbying} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } } }} />
          <ExplainText>Static values to be replaced with processed OpenSecrets files.</ExplainText>
        </Card>
      </div>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="Institutions & policy" />
        <ExplainText>Fiscal priorities, tax design, and sectoral lobbying tilt outcomes toward particular coalitions.</ExplainText>
      </Card>
    </div>
  );
}
