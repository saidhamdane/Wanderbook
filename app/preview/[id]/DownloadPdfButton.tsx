'use client';

import { useState } from 'react';

export function DownloadPdfButton({ magazineId }: { magazineId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ magazineId })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'PDF generation failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wanderbook-' + magazineId + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={download}
        disabled={loading}
        className={
          'px-4 py-2 rounded-full text-xs font-semibold tracking-widest transition ' +
          (loading
            ? 'bg-amber-300 text-white cursor-wait'
            : 'bg-amber-500 hover:bg-amber-600 text-white')
        }
      >
        {loading ? 'PREPARING…' : '⬇ DOWNLOAD PDF'}
      </button>
      {error && <span className="text-[10px] text-red-300 max-w-[160px] leading-tight">{error}</span>}
    </div>
  );
}
