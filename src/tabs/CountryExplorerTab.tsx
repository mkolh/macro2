import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Pill } from '../components/Pill';
import { Spinner } from '../components/Spinner';
import { useCountryData, useCountryList } from '../data/hooks';
import { TimeSeriesPoint } from '../data/types';

function buildLineChart(label: string, color: string, points?: TimeSeriesPoint[]) {
  if (!points?.length) return null;

  return {
    labels: points.map((p) => p.date),
    datasets: [
      {
        label,
        data: points.map((p) => p.value),
        borderColor: color,
        tension: 0.3
      }
    ]
  };
}

const baseOptions = {
  responsive: true,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { labels: { color: '#e5e7eb' } } },
  scales: {
    x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
    y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
  }
};

export function CountryExplorerTab() {
  const { data: countries, loading, error } = useCountryList();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const { data: countryData, loading: countryLoading, error: countryError } = useCountryData(selectedCode);

  useEffect(() => {
    if (!selectedCode && countries?.length) setSelectedCode(countries[0].code);
  }, [countries, selectedCode]);

  const availableSeries = useMemo(() => {
    if (!countryData) return [] as string[];
    const seriesKeys = Object.keys(countryData.macro.series ?? {});
    const derivedKeys = Object.keys(countryData.macro.derived ?? {});
    return [...seriesKeys, ...derivedKeys];
  }, [countryData]);

  if (loading || countryLoading) return <Spinner />;
  if (error || countryError) return <Card className="text-rose-200">Failed to load country data from JSON.</Card>;
  if (!countries?.length) return <Card>No countries found in the dataset.</Card>;

  const series = countryData?.macro.series ?? {};
  const derived = countryData?.macro.derived ?? {};
  const decades = countryData?.macro.historicalView?.decades ?? [];

  const gdpChart = buildLineChart('Real GDP', '#3b82f6', series.gdpReal);
  const gdpGrowthChart = buildLineChart('GDP growth %', '#22c55e', derived.gdpGrowthYoY ?? series.gdpGrowth);
  const inflationChart = buildLineChart('Inflation %', '#f97316', derived.inflationYoY ?? series.inflation);
  const unemploymentChart = buildLineChart('Unemployment %', '#22d3ee', series.unemploymentRate);
  const policyChart = buildLineChart('Policy rate %', '#a855f7', series.fedFundsRate);
  const debtChart = buildLineChart('Debt to GDP %', '#e879f9', series.debtToGdp);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardHeader
              title="Country explorer"
              subtitle="Switch between any country present in the uploaded JSON dataset"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {availableSeries.map((key) => (
                <Pill key={key} label={key} tone="accent" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <label className="text-slate-300">Choose country</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-100"
              value={selectedCode ?? ''}
              onChange={(e) => setSelectedCode(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            {countryData && <span className="text-slate-400">Currently viewing: {countryData.name}</span>}
          </div>
        </div>
      </Card>

      <div className="card-grid cols-2">
        {gdpChart && (
          <Card>
            <CardHeader title="GDP level" subtitle="Real activity" />
            <ChartContainer type="line" data={gdpChart} options={baseOptions} />
            <ExplainText>Values pulled directly from macro.series.gdpReal.</ExplainText>
          </Card>
        )}
        {gdpGrowthChart && (
          <Card>
            <CardHeader title="GDP growth" subtitle="Real growth %" />
            <ChartContainer type="line" data={gdpGrowthChart} options={baseOptions} />
            <ExplainText>Uses either derived gdpGrowthYoY or series gdpGrowth when available.</ExplainText>
          </Card>
        )}
      </div>

      <div className="card-grid cols-2">
        {inflationChart && (
          <Card>
            <CardHeader title="Inflation" subtitle="Price dynamics" />
            <ChartContainer type="line" data={inflationChart} options={baseOptions} />
            <ExplainText>Pulls inflationYoY (derived) or inflation series from the selected country.</ExplainText>
          </Card>
        )}
        {unemploymentChart && (
          <Card>
            <CardHeader title="Unemployment" subtitle="Labor market" />
            <ChartContainer type="line" data={unemploymentChart} options={baseOptions} />
            <ExplainText>Reads unemploymentRate straight from macro.series.</ExplainText>
          </Card>
        )}
      </div>

      <div className="card-grid cols-2">
        {policyChart && (
          <Card>
            <CardHeader title="Policy rate" subtitle="Central bank" />
            <ChartContainer type="line" data={policyChart} options={baseOptions} />
            <ExplainText>Visualizes the fedFundsRate/policy series in the dataset.</ExplainText>
          </Card>
        )}
        {debtChart && (
          <Card>
            <CardHeader title="Debt to GDP" subtitle="Sustainability" />
            <ChartContainer type="line" data={debtChart} options={baseOptions} />
            <ExplainText>Debt burden pulled from macro.series.debtToGdp.</ExplainText>
          </Card>
        )}
      </div>

      {decades.length > 0 && (
        <Card>
          <CardHeader title="Historical decades" subtitle="Long-run averages" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-2">Decade</th>
                  <th className="py-2">Growth avg %</th>
                  <th className="py-2">Inflation avg %</th>
                  <th className="py-2">Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {decades.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2 text-slate-200">{row.label}</td>
                    <td className="py-2">{row.avgGrowth}</td>
                    <td className="py-2">{row.avgInflation}</td>
                    <td className="py-2 text-slate-400">{row.startYear} – {row.endYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ExplainText>Decade averages supplied by macro.historicalView.decades for the selected country.</ExplainText>
        </Card>
      )}
    </div>
  );
}
