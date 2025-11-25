import React from 'react';
import clsx from 'clsx';

interface StatusChipProps {
  mode: 'dummy' | 'live';
  label?: string;
}

export function StatusChip({ mode, label }: StatusChipProps) {
  const tone = mode === 'live' ? 'bg-emerald-600/30 text-emerald-200' : 'bg-slate-700 text-slate-200';
  const text = label ?? (mode === 'live' ? 'Mode: Live data' : 'Mode: Dummy data only');

  return (
    <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold border border-slate-700', tone)}>
      {text}
    </span>
  );
}
