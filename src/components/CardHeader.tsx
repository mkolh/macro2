import React from 'react';
import { Pill } from './Pill';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function CardHeader({ title, subtitle, rightElement }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{subtitle}</p>
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      </div>
      {rightElement ? <Pill label={rightElement} /> : null}
    </div>
  );
}
