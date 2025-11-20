import React from 'react';
import clsx from 'clsx';

interface PillProps {
  label: React.ReactNode;
  tone?: 'default' | 'accent' | 'warn';
  className?: string;
}

export function Pill({ label, tone = 'default', className }: PillProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
        tone === 'accent' && 'bg-blue-600/20 text-blue-300 border border-blue-500/40',
        tone === 'warn' && 'bg-amber-600/20 text-amber-300 border border-amber-500/40',
        tone === 'default' && 'bg-slate-800 text-slate-200 border border-slate-700',
        className
      )}
    >
      {label}
    </span>
  );
}
