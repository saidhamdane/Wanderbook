'use client';

import { useEffect, useRef, useState } from 'react';
import { DownloadPdfButton } from './DownloadPdfButton';
import Link from 'next/link';

const PAGE_COUNT = 8;
const PAGE_W = 794;
const PAGE_H = 1123;

export function RedBoldViewer({ magazineId }: { magazineId: string }) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const update = () => {
      if (columnRef.current) {
        const w = columnRef.current.getBoundingClientRect().width;
        setScale(w / PAGE_W);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (columnRef.current) ro.observe(columnRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: '#0f172a',
          color: '#fff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '4px solid #f59e0b'
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 18,
            color: '#fff',
            textDecoration: 'none'
          }}
        >
          Wanderbook
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DownloadPdfButton magazineId={magazineId} />
          <Link
            href="/create"
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid #fcd34d',
              color: '#fde68a',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textDecoration: 'none'
            }}
          >
            CREATE NEW
          </Link>
        </div>
      </header>

      <div style={{ padding: '24px 16px 40px' }}>
      <div
        ref={columnRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          maxWidth: 826,
          margin: '0 auto',
          width: '100%'
        }}
      >
        {Array.from({ length: PAGE_COUNT }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            style={{
              width: PAGE_W * scale,
              height: PAGE_H * scale,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              borderRadius: 2,
              flexShrink: 0,
              marginBottom: 16
            }}
          >
            <iframe
              src={`/api/inject-red-bold/${magazineId}?page=${n}`}
              style={{
                width: PAGE_W,
                height: PAGE_H,
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                transformOrigin: 'top left',
                transform: `scale(${scale})`
              }}
              title={`Page ${n}`}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
