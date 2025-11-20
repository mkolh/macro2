import React from 'react';

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10 text-slate-400">
      <div className="animate-spin h-5 w-5 border-2 border-slate-500 border-t-transparent rounded-full mr-2" />
      Loading data...
    </div>
  );
}
