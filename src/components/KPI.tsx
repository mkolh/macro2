import React from 'react';
import clsx from 'clsx';

interface KPIProps {
  label: string;
  value: string;
  trend?: string;
  trendType?: 'good' | 'bad' | 'warn' | 'neutral';
}

export function KPI({ label, value, trend, trendType = 'neutral' }: KPIProps) {
  const trendTone = clsx(
    trendType === 'good' && 'text-emerald-300',
    trendType === 'bad' && 'text-rose-300',
    trendType === 'warn' && 'text-amber-300',
    trendType === 'neutral' && 'text-slate-300'
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <div className="text-2xl font-semibold text-slate-50">{value}</div>
      {trend ? <div className={clsx('text-sm font-medium', trendTone)}>{trend}</div> : null}
    </div>
  );
}
