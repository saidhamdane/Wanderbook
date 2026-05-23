'use client';

import { useEffect, useRef, useState } from 'react';

const LINES = [
  { text: 'Placing your photos…',             delay: 500  },
  { text: 'Writing your cover story…',         delay: 1500 },
  { text: 'Designing editorial pages…',        delay: 2500 },
  { text: 'Adding finishing touches…',         delay: 3500 },
  { text: 'Your magazine is ready.',           delay: 4500 },
];

const ANIMATION_DONE_AT = 5800; // ms after which we consider animation complete

type Props = {
  /** Set once the API call resolves with a magazine id */
  magId: string | null;
  onReady: (id: string) => void;
};

export function CinematicOverlay({ magId, onReady }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), line.delay));
    });
    timers.push(setTimeout(() => setAnimDone(true), ANIMATION_DONE_AT));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!animDone || !magId || firedRef.current) return;
    firedRef.current = true;
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 }, colors: ['#f59e0b', '#fcd34d', '#fff', '#fbbf24'] });
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { x: 0.2, y: 0.6 } }), 200);
      setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { x: 0.8, y: 0.6 } }), 400);
      setTimeout(() => onReady(magId), 1200);
    });
  }, [animDone, magId, onReady]);

  // If API finishes before animation: wait for animation
  // If animation finishes first: wait for API (shows "Your magazine is ready." while waiting)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,5,15,0.97)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
    }}>
      {/* Wanderbook wordmark */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 13, letterSpacing: '8px', color: '#f59e0b',
        textTransform: 'uppercase', marginBottom: 56,
        opacity: 0.9,
      }}>
        WANDERBOOK
      </div>

      {/* Text lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 260 }}>
        {LINES.map((line, i) => {
          const visible = i < visibleCount;
          const isFinal = i === LINES.length - 1;
          return (
            <div
              key={i}
              style={{
                fontFamily: isFinal ? "'Playfair Display', Georgia, serif" : 'system-ui, sans-serif',
                fontSize: isFinal ? 22 : 15,
                fontWeight: isFinal ? 700 : 400,
                color: isFinal ? '#f59e0b' : 'rgba(255,255,255,0.85)',
                letterSpacing: isFinal ? '0.05em' : '0.01em',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Subtle spinner — only while waiting after animation completes */}
      {animDone && !magId && (
        <div style={{ marginTop: 40 }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            border: '2px solid rgba(245,158,11,0.2)',
            borderTopColor: '#f59e0b',
            animation: 'cspin 0.8s linear infinite',
          }} />
          <style>{`@keyframes cspin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </div>
  );
}
