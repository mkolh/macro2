import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
