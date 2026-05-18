'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Analyzing your photos…',
  'Writing your story…',
  'Choosing photo placements…',
  'Building your magazine…',
  'Almost ready…'
];

export function LoadingMagazine() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInt = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 1600);
    const progInt = setInterval(() => {
      setProgress((p) => (p < 95 ? p + 1 : p));
    }, 80);
    return () => {
      clearInterval(stepInt);
      clearInterval(progInt);
    };
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-6xl mb-4 animate-bounce">📖</div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        Building your magazine
      </h2>
      <p className="mt-2 text-slate-500 text-sm">This usually takes about ten seconds.</p>
      <div className="mt-6 w-full max-w-md h-2 bg-amber-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all"
          style={{ width: progress + '%' }}
        />
      </div>
      <div className="mt-4 text-slate-700 font-medium">{STEPS[step]}</div>
    </div>
  );
}
