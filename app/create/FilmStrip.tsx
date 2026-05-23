'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { files: File[] };

export function FilmStrip({ files }: Props) {
  const [urls, setUrls] = useState<string[]>([]);
  const prev = useRef<string[]>([]);

  useEffect(() => {
    // Revoke old URLs then create new ones
    prev.current.forEach((u) => URL.revokeObjectURL(u));
    const next = files.map((f) => URL.createObjectURL(f));
    prev.current = next;
    setUrls(next);
    return () => next.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  if (urls.length === 0) return null;

  const SPROCKET_COUNT = 5;

  return (
    <div style={{ marginTop: 20 }}>
      {/* Count badge */}
      <div style={{
        fontSize: 11, letterSpacing: '3px', fontWeight: 700,
        color: '#f59e0b', textTransform: 'uppercase', marginBottom: 10,
        fontFamily: 'system-ui',
      }}>
        {urls.length} {urls.length === 1 ? 'memory' : 'memories'} ready
      </div>

      {/* Film strip wrapper */}
      <div style={{
        position: 'relative', background: '#111',
        borderRadius: 4, overflow: 'hidden',
        paddingTop: 14, paddingBottom: 14,
      }}>
        {/* Top sprocket strip */}
        <SprocketRow count={SPROCKET_COUNT} />

        {/* Scrollable photo frames */}
        <div style={{
          display: 'flex', gap: 4,
          overflowX: 'auto', padding: '6px 8px',
          scrollbarWidth: 'none',
        }}>
          {urls.map((url, i) => (
            <FilmFrame key={i} url={url} index={i} />
          ))}
        </div>

        {/* Bottom sprocket strip */}
        <SprocketRow count={SPROCKET_COUNT} />
      </div>
    </div>
  );
}

function SprocketRow({ count }: { count: number }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around',
      padding: '0 8px', height: 14, alignItems: 'center',
    }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{
          width: 10, height: 8, borderRadius: 2,
          background: '#333', border: '1px solid #444',
          flexShrink: 0,
        }} />
      ))}
    </div>
  );
}

function FilmFrame({ url, index }: { url: string; index: number }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      style={{
        flexShrink: 0,
        width: 90, height: 120,
        overflow: 'hidden', borderRadius: 2,
        border: '1px solid #333',
        position: 'relative',
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateX(0)' : 'translateX(24px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
        (e.currentTarget as HTMLElement).style.zIndex = '10';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.zIndex = '1';
      }}
    >
      <img
        src={url}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'sepia(0.25) contrast(1.05)',
        }}
        alt={`Photo ${index + 1}`}
      />
    </div>
  );
}
