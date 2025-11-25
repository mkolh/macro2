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
    return <Card className="text-rose-200">Failed to load data. Please verify the uploaded JSON file.</Card>;
  if (!usData || !worldData) return null;

  const latestGrowth = usData.gdpGrowthYoY.at(-1)?.value ?? 0;
  const latestInflation = usData.inflationYoY.at(-1)?.value ?? 0;
  const latestUnemployment = usData.unemploymentRate.at(-1)?.value ?? 0;
  const cycle = classifyCycle(latestGrowth, latestInflation, latestUnemployment);
  const bullets = describeCycle(latestGrowth, latestInflation, latestUnemployment);

  const latestGDP = usData.gdpReal.at(-1)?.value ?? 0;
  const prevGDP = usData.gdpReal.at(-2)?.value ?? latestGDP;
  const gdpChange = latestGDP - prevGDP;

  const usChartData = {
    labels: usData.gdpReal.map((p) => p.date),
    datasets: [
      {
        label: 'US Real GDP (trn)',
        data: usData.gdpReal.map((p) => p.value),
        borderColor: '#3b82f6',
        tension: 0.3,
        yAxisID: 'y'
      },
      {
        label: 'CPI inflation YoY %',
        data: usData.inflationYoY.map((p) => p.value),
        borderColor: '#f97316',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const worldChartData = {
    labels: worldData.gdpGrowth.map((p) => p.date),
    datasets: [
      {
        label: 'World GDP growth %',
        data: worldData.gdpGrowth.map((p) => p.value),
        borderColor: '#22c55e',
        tension: 0.3
      },
      {
        label: 'World inflation %',
        data: worldData.inflation.map((p) => p.value),
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
        <KPI label="US real GDP" value={`${latestGDP.toFixed(1)} trn`} trend={`Δ ${gdpChange.toFixed(1)} vs last obs`} trendType="good" />
        <KPI label="CPI inflation" value={`${latestInflation.toFixed(1)}%`} trend="YoY" trendType="warn" />
        <KPI label="Unemployment" value={`${latestUnemployment.toFixed(1)}%`} trend="Headline" trendType="neutral" />
      </div>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="US macro snapshot" subtitle="GDP & inflation" />
          <ChartContainer type="line" data={usChartData} options={chartOptions} />
          <ExplainText>Values pulled from the uploaded JSON file: GDP levels and CPI year-over-year inflation.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="World macro snapshot" subtitle="Growth & inflation" />
          <ChartContainer type="line" data={worldChartData} options={chartOptions} />
          <ExplainText>World aggregates supplied by the JSON file replacing previous API calls.</ExplainText>
        </Card>
      </div>
    </div>
  );
}
