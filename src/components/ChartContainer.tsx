import React from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  TimeScale,
  Filler
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line, Bar, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

type ChartType = 'line' | 'bar' | 'scatter';

interface ChartContainerProps {
  type: ChartType;
  data: any;
  options?: any;
  className?: string;
}

export function ChartContainer({ type, data, options, className }: ChartContainerProps) {
  const chart =
    type === 'bar' ? (
      <Bar data={data} options={options} />
    ) : type === 'scatter' ? (
      <Scatter data={data} options={options} />
    ) : (
      <Line data={data} options={options} />
    );

  return <div className={className}>{chart}</div>;
}
