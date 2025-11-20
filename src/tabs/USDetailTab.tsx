import React, { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { CardHeader } from '../components/CardHeader';
import { ChartContainer } from '../components/ChartContainer';
import { ExplainText } from '../components/ExplainText';
import { Spinner } from '../components/Spinner';
import { Pill } from '../components/Pill';
import { useUSMacroData } from '../data/hooks';

export function USDetailTab() {
  const { data, loading, error } = useUSMacroData();
  const [shock, setShock] = useState(0);

  const shockText = useMemo(() => {
    const deltaUnemp = (shock * 0.3).toFixed(1);
    const deltaInfl = (shock * -0.2).toFixed(1);
    return `Toy shock: unemployment ${deltaUnemp}%pts, inflation ${deltaInfl}%pts vs baseline.`;
  }, [shock]);

  if (loading) return <Spinner />;
  if (error) return <Card className="text-rose-200">Failed to load US data.</Card>;
  if (!data) return null;

  const baseOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#e5e7eb' } } },
    scales: {
      x: { ticks: { color: '#9ca3af' } },
      y: { ticks: { color: '#9ca3af' } }
    }
  };

  const gdpChart = {
    labels: data.gdp.map((p) => p.date),
    datasets: [{ label: 'Real GDP (trn)', data: data.gdp.map((p) => p.value), borderColor: '#3b82f6', tension: 0.3 }]
  };

  const cpiFunds = {
    labels: data.inflation.map((p) => p.date),
    datasets: [
      {
        label: 'CPI %',
        data: data.inflation.map((p) => p.value),
        borderColor: '#f97316',
        yAxisID: 'y'
      },
      {
        label: 'Fed Funds %',
        data: data.fedFunds?.map((p) => p.value) ?? [],
        borderColor: '#22c55e',
        yAxisID: 'y1'
      }
    ]
  };

  const dualOptions = {
    ...baseOptions,
    scales: {
      x: { ticks: { color: '#9ca3af' } },
      y: { ticks: { color: '#9ca3af' } },
      y1: { position: 'right', ticks: { color: '#9ca3af' }, grid: { drawOnChartArea: false } }
    }
  };

  const unemploymentChart = {
    labels: data.unemployment.map((p) => p.date),
    datasets: [{ label: 'Unemployment %', data: data.unemployment.map((p) => p.value), borderColor: '#22d3ee' }]
  };

  const debtChart = {
    labels: data.debtToGdp?.map((p) => p.date) ?? [],
    datasets: [
      { label: 'Debt / GDP %', data: data.debtToGdp?.map((p) => p.value) ?? [], borderColor: '#a855f7', tension: 0.3 }
    ]
  };

  const phillips = {
    datasets: [
      {
        label: 'Phillips curve',
        data: data.unemployment.map((u, idx) => ({ x: u.value, y: data.inflation[idx]?.value ?? 0 })),
        backgroundColor: '#3b82f6'
      }
    ]
  };

  const okun = {
    datasets: [
      {
        label: 'Okun points',
        data: data.gdp.map((g, idx) => ({ x: g.value - (data.gdp[idx - 1]?.value ?? g.value), y: (data.unemployment[idx]?.value ?? 0) - (data.unemployment[idx - 1]?.value ?? 0) })),
        backgroundColor: '#f59e0b'
      }
    ]
  };

  const tableRows = [
    { indicator: 'GDP (trn)', value: data.gdp.at(-1)?.value.toFixed(1), change: '+0.6', comment: 'Above trend' },
    { indicator: 'Inflation %', value: data.inflation.at(-1)?.value.toFixed(1), change: '-0.2', comment: 'Easing slowly' },
    { indicator: 'Unemployment %', value: data.unemployment.at(-1)?.value.toFixed(1), change: '+0.1', comment: 'Labor market cooling' },
    { indicator: 'Debt / GDP %', value: data.debtToGdp?.at(-1)?.value.toFixed(1), change: '+1.5', comment: 'Rising debt ratio' }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="US real GDP" subtitle="Level" />
          <ChartContainer type="line" data={gdpChart} options={baseOptions} />
          <ExplainText>Quarterly real GDP path in trillions.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="CPI vs Fed funds" subtitle="Prices & policy" />
          <ChartContainer type="line" data={cpiFunds} options={dualOptions} />
          <ExplainText>Policy rates vs inflation to show stance.</ExplainText>
        </Card>
      </div>

      <Card>
        <CardHeader title="Policy shock" subtitle="Toy slider" />
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={-2}
            max={2}
            step={0.5}
            value={shock}
            onChange={(e) => setShock(Number(e.target.value))}
            className="w-full"
          />
          <Pill label={shockText} tone="warn" />
        </div>
      </Card>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Unemployment" subtitle="Headline rate" />
          <ChartContainer type="line" data={unemploymentChart} options={baseOptions} />
          <ExplainText>Jobless rate trend vs prior years.</ExplainText>
        </Card>
        <Card>
          <CardHeader title="Debt to GDP" subtitle="Federal" />
          <ChartContainer type="line" data={debtChart} options={baseOptions} />
          <ExplainText>Debt sustainability gauge.</ExplainText>
        </Card>
      </div>

      <div className="card-grid cols-2">
        <Card>
          <CardHeader title="Phillips curve" subtitle="Inflation vs unemployment" />
          <ChartContainer type="scatter" data={phillips} options={baseOptions} />
        </Card>
        <Card>
          <CardHeader title="Okun's law" subtitle="Growth vs unemployment change" />
          <ChartContainer type="scatter" data={okun} options={baseOptions} />
        </Card>
      </div>

      <Card>
        <CardHeader title="US cross-section" subtitle="Last year" />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="text-slate-400">
              <tr>
                <th className="py-2">Indicator</th>
                <th className="py-2">Value</th>
                <th className="py-2">YoY change</th>
                <th className="py-2">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tableRows.map((row) => (
                <tr key={row.indicator}>
                  <td className="py-2 text-slate-200">{row.indicator}</td>
                  <td className="py-2">{row.value}</td>
                  <td className="py-2">{row.change}</td>
                  <td className="py-2 text-slate-300">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ExplainText>Quick US snapshot with dummy YoY moves.</ExplainText>
      </Card>

      <Card>
        <CardHeader title="Who gains / loses" subtitle="US detail" />
        <ExplainText>
          A hotter economy often boosts profits and asset prices; tighter policy can slow inflation but may raise unemployment for
          workers with less bargaining power.
        </ExplainText>
      </Card>
    </div>
  );
}
