import React from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { KPI } from '../components/KPI';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Pill } from '../components/Pill';
import { Spinner } from '../components/Spinner';
import { useGlobalMacroData, useUSMacroData } from '../data/hooks';
import { classifyCycle, describeCycle } from '../utils/classifiers';

export function OverviewTab() {
  const {
    data: usData,
    loading: usLoading,
    error: usError
  } = useUSMacroData();
  const {
    data: worldData,
    loading: worldLoading,
    error: worldError
  } = useGlobalMacroData();

  if (usLoading || worldLoading) return <Spinner />;
  if (usError || worldError)
    return <Card className="text-rose-200">Failed to load data. Showing nothing for now.</Card>;
  if (!usData || !worldData) return null;

  const latestGDP = usData.gdp.at(-1)?.value ?? 0;
  const prevGDP = usData.gdp.at(-2)?.value ?? latestGDP;
  const latestInflation = usData.inflation.at(-1)?.value ?? 0;
  const latestUnemployment = usData.unemployment.at(-1)?.value ?? 0;
  const cycle = classifyCycle(latestGDP, latestInflation, latestUnemployment);
  const bullets = describeCycle(latestGDP, latestInflation, latestUnemployment);

  const gdpChange = latestGDP - prevGDP;
  const usChartData = {
    labels: usData.gdp.map((p) => p.date),
    datasets: [
      {
        label: 'US Real GDP (trn)',
        data: usData.gdp.map((p) => p.value),
        borderColor: '#3b82f6',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'CPI inflation %',
        data: usData.inflation.map((p) => p.value),
        borderColor: '#f97316',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const worldChartData = {
    labels: worldData.countrySeries.World.map((p) => p.date),
    datasets: [
      {
        label: 'World GDP growth %',
        data: worldData.countrySeries.World.map((p) => p.value),
        borderColor: '#22c55e',
        tension: 0.3
      },
      {
        label: 'World inflation %',
        data: worldData.countrySeries.Inflation.map((p) => p.value),
        borderColor: '#fbbf24',
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#e5e7eb' } }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' } },
      y: { ticks: { color: '#9ca3af' } },
      y1: { position: 'right', ticks: { color: '#9ca3af' }, grid: { drawOnChartArea: false } }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title={`US cycle: ${cycle}`} subtitle="State of cycle" />
        <div className="grid gap-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Pill label="Growth" tone="accent" /> {bullets.growth}
          </div>
          <div className="flex items-center gap-2">
            <Pill label="Labor market" tone="accent" /> {bullets.laborMarket}
          </div>
          <div className="flex items-center gap-2">
            <Pill label="Inflation" tone="accent" /> {bullets.inflation}
          </div>
        </div>
      </Card>

      <div className="card-grid cols-3">
        <KPI label="US real GDP" value={`${latestGDP.toFixed(1)} trn`} trend={`Δ ${gdpChange.toFixed(1)} vs last year`} trendType="good" />
        <KPI label="CPI inflation" value={`${latestInflation.toFixed(1)}%`} trend="Goal ~2%" trendType="warn" />
        <KPI label="Unemployment" value={`${latestUnemployment.toFixed(1)}%`} trend="Steady" trendType="neutral" />
      </div>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="US macro snapshot" subtitle="GDP & inflation" />
          <ChartContainer type="line" data={usChartData} options={chartOptions} />
          <ExplainText>Simple snapshot combining output and prices for the last decade.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="World macro snapshot" subtitle="Growth & inflation" />
          <ChartContainer type="line" data={worldChartData} options={chartOptions} />
          <ExplainText>Global context using placeholder World Bank indicators.</ExplainText>
        </Card>
      </div>

      <Card>
        <CardHeader title="Who gains / who loses" subtitle="Distributional lens" />
        <ExplainText>
          In expansions, profits and top income shares often rise faster than wages. A cooling cycle can ease inflation but risks higher
          unemployment for vulnerable groups.
        </ExplainText>
      </Card>
    </div>
  );
}
