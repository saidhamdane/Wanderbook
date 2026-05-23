'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_COUNT = 8;
const PAGE_W = 794;
const PAGE_H = 1123;

export function FlipViewer({ magazineId }: { magazineId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [current, setCurrent] = useState(1);
  const [incoming, setIncoming] = useState(1);
  const [phase, setPhase] = useState<'idle' | 'fold-out' | 'fold-in'>('idle');
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [liveRot, setLiveRot] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.getBoundingClientRect().width;
        setScale(Math.min(1, (w - 32) / PAGE_W));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const flip = useCallback(
    (dir: 'next' | 'prev') => {
      if (phase !== 'idle') return;
      const target = dir === 'next' ? current + 1 : current - 1;
      if (target < 1 || target > PAGE_COUNT) return;
      setFlipDir(dir);
      setIncoming(target);
      setPhase('fold-out');
      setTimeout(() => setPhase('fold-in'), 300);
      setTimeout(() => {
        setCurrent(target);
        setPhase('idle');
      }, 600);
    },
    [phase, current],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (phase !== 'idle') return;
    const d = e.touches[0].clientX - touchStartX.current;
    setLiveRot(Math.max(-25, Math.min(25, -d / 4)));
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    setLiveRot(0);
    const d = e.changedTouches[0].clientX - touchStartX.current;
    if (d < -50) flip('next');
    else if (d > 50) flip('prev');
  };

  const scaledW = PAGE_W * scale;
  const scaledH = PAGE_H * scale;

  const outAngle = flipDir === 'next' ? -90 : 90;
  const inStartAngle = flipDir === 'next' ? 90 : -90;

  const curRot = phase === 'idle' ? liveRot : outAngle;
  const incRot = phase === 'fold-in' ? 0 : inStartAngle;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', userSelect: 'none', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Book stage */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
        <div style={{ position: 'relative', width: scaledW, height: scaledH }}>

          {/* Current page */}
          <PageSheet
            src={`/api/inject-red-bold/${magazineId}?page=${current}`}
            pageNum={current}
            scale={scale}
            rotation={curRot}
            animate={phase !== 'idle'}
            showShadow={phase !== 'idle' || liveRot !== 0}
          />

          {/* Incoming page — only mounted during flip */}
          {phase !== 'idle' && (
            <PageSheet
              src={`/api/inject-red-bold/${magazineId}?page=${incoming}`}
              pageNum={incoming}
              scale={scale}
              rotation={incRot}
              animate={phase === 'fold-in'}
              showShadow={false}
            />
          )}

          {/* Tap zones */}
          <div
            onClick={() => flip('prev')}
            style={{
              position: 'absolute', left: 0, top: 0, width: '20%', height: '100%',
              cursor: current > 1 && phase === 'idle' ? 'pointer' : 'default',
              zIndex: 20,
            }}
          />
          <div
            onClick={() => flip('next')}
            style={{
              position: 'absolute', right: 0, top: 0, width: '20%', height: '100%',
              cursor: current < PAGE_COUNT && phase === 'idle' ? 'pointer' : 'default',
              zIndex: 20,
            }}
          />
        </div>
      </div>

      {/* Hidden preloads */}
      <div style={{ display: 'none' }}>
        {[current - 1, current + 1]
          .filter((p) => p >= 1 && p <= PAGE_COUNT)
          .map((p) => (
            <iframe
              key={p}
              src={`/api/inject-red-bold/${magazineId}?page=${p}`}
              title={`preload-${p}`}
            />
          ))}
      </div>

      {/* Page indicator */}
      <p style={{
        textAlign: 'center', margin: '8px 0 4px',
        color: '#94a3b8', fontSize: 13, letterSpacing: '0.12em',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {current} / {PAGE_COUNT}
      </p>

      {/* Desktop nav arrows */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, paddingBottom: 28 }}>
        <NavBtn
          onClick={() => flip('prev')}
          disabled={current <= 1 || phase !== 'idle'}
          label="&#8249;"
        />
        <NavBtn
          onClick={() => flip('next')}
          disabled={current >= PAGE_COUNT || phase !== 'idle'}
          label="&#8250;"
        />
      </div>
    </div>
  );
}

function PageSheet({
  src, pageNum, scale, rotation, animate, showShadow,
}: {
  src: string;
  pageNum: number;
  scale: number;
  rotation: number;
  animate: boolean;
  showShadow: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: 'center center',
        transform: `perspective(1500px) rotateY(${rotation}deg)`,
        transition: animate
          ? 'transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
          : 'none',
        overflow: 'hidden',
        boxShadow:
          '3px 6px 40px rgba(0,0,0,0.6), -3px 2px 20px rgba(0,0,0,0.35)',
        borderRadius: 2,
        backfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    >
      <iframe
        src={src}
        style={{
          width: PAGE_W,
          height: PAGE_H,
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
        }}
        title={`Page ${pageNum}`}
      />
      {/* Page-curl shadow overlay */}
      {showShadow && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.2) 100%)',
          }}
        />
      )}
    </div>
  );
}

function NavBtn({
  onClick, disabled, label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '1px solid #334155',
        background: disabled ? '#0f172a' : '#1e293b',
        color: disabled ? '#475569' : '#e2e8f0',
        fontSize: 22,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}
