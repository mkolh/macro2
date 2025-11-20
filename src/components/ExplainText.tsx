import React from 'react';

interface ExplainTextProps {
  children: React.ReactNode;
}

export function ExplainText({ children }: ExplainTextProps) {
  return <p className="text-sm text-slate-400 mt-3 leading-relaxed">{children}</p>;
}
