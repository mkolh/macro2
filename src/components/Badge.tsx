import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  label: string;
  tone?: 'success' | 'error' | 'warn' | 'info';
}

export function Badge({ label, tone = 'info' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold',
        tone === 'success' && 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40',
        tone === 'error' && 'bg-rose-500/20 text-rose-200 border border-rose-500/40',
        tone === 'warn' && 'bg-amber-500/20 text-amber-200 border border-amber-500/40',
        tone === 'info' && 'bg-slate-700 text-slate-200 border border-slate-600'
      )}
    >
      {label}
    </span>
  );
}
