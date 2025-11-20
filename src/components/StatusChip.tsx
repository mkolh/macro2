import React from 'react';
import clsx from 'clsx';

interface StatusChipProps {
  mode: 'dummy' | 'live';
}

export function StatusChip({ mode }: StatusChipProps) {
  const tone = mode === 'live' ? 'bg-emerald-600/30 text-emerald-200' : 'bg-slate-700 text-slate-200';
  const label = mode === 'live' ? 'Mode: Live data' : 'Mode: Dummy data only';

  return (
    <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold border border-slate-700', tone)}>
      {label}
    </span>
  );
}
