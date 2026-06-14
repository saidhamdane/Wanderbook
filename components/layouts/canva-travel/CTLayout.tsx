/* eslint-disable react/no-unescaped-entities */
'use client';
import { useState, useEffect } from 'react';
import { LayoutProps } from '@/lib/magazine/types';

// Canva-travel pages are 1920×1080 (landscape).
// We scale to fit a 794px-wide column while keeping the 16:9 ratio.
const NATIVE_W = 1920;
const NATIVE_H = 1080;

export default function CTLayout({ slots, palette, fonts, pageIndex }: LayoutProps) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const magazineId = (slots as any).magazineId || '';
  const pageNum = pageIndex + 1;

  useEffect(() => {
    if (!magazineId) { setLoading(false); return; }
    fetch(`/api/inject-canva-travel/${magazineId}?page=${pageNum}`)
      .then(r => r.text())
      .then(h => { setHtml(h); setLoading(false); })
      .catch(() => setLoading(false));
  }, [magazineId, pageNum]);

  // Scale the 1920×1080 canvas to fit 794px wide
  const SCALE = 794 / NATIVE_W;
  const H = Math.round(NATIVE_H * SCALE); // ≈ 447px — true landscape ratio

  if (loading) return (
    <div style={{ width: 794, height: H, background: '#009999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontFamily: 'sans-serif', fontSize: 13, opacity: 0.7 }}>Loading page {pageNum}…</div>
    </div>
  );

  if (!html) return (
    <div style={{ width: 794, height: H, background: '#009999', overflow: 'hidden' }}>
      <img src={`/templates/canva-pages/page-${pageNum}.png`} style={{ width: '100%', height: '100%', objectFit: 'fill' }} alt="" />
    </div>
  );

  return (
    <div style={{ width: 794, height: H, overflow: 'hidden', position: 'relative' }}>
      {/* iframe isolates the inject-canva-travel HTML (which is 1920×1080) and scales it */}
      <iframe
        srcDoc={html}
        style={{
          width: NATIVE_W,
          height: NATIVE_H,
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${SCALE})`,
          pointerEvents: 'none',
        }}
        title={`Page ${pageNum}`}
        sandbox="allow-same-origin"
      />
    </div>
  );
}
