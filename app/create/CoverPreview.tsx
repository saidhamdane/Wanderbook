'use client';

import { useEffect, useState } from 'react';

type Palette = {
  primary: string;
  accent: string;
  background: string;
  text: string;
};

type Props = {
  destination: string;
  travelers: string;
  palette: Palette;
  photoFile: File | null;
};

export function CoverPreview({ destination, travelers, palette, photoFile }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photoFile) { setPhotoUrl(null); return; }
    const url = URL.createObjectURL(photoFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const dest = destination.trim().toUpperCase() || 'YOUR DESTINATION';
  const sub = travelers.trim()
    ? travelers.trim().split(/\s+/).slice(0, 4).join(' ')
    : 'Your Family';
  const year = new Date().getFullYear();

  // Scale: show at 200px wide (real page is 794px)
  const W = 200;
  const H = Math.round(W * (1123 / 794));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{
        fontSize: 9, letterSpacing: '4px', color: '#64748b',
        fontWeight: 600, textTransform: 'uppercase',
      }}>
        LIVE PREVIEW
      </div>
      <div
        style={{
          width: W, height: H,
          position: 'relative', overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25)',
          background: palette.primary,
          flexShrink: 0,
        }}
      >
        {/* Background photo */}
        {photoUrl ? (
          <img
            src={photoUrl}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease',
            }}
            alt=""
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.accent}44 100%)`,
          }} />
        )}

        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          padding: '14px 12px',
        }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: 6, letterSpacing: '3px', color: palette.accent,
              fontWeight: 700, textTransform: 'uppercase', fontFamily: 'system-ui',
            }}>
              WANDERBOOK
            </span>
            <span style={{
              fontSize: 5, letterSpacing: '2px', color: 'rgba(255,255,255,0.6)',
              fontFamily: 'system-ui', textTransform: 'uppercase',
            }}>
              {year}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Accent rule */}
          <div style={{ width: 24, height: 1.5, background: palette.accent, marginBottom: 8 }} />

          {/* Destination title — live typing */}
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: dest.length > 14 ? 11 : dest.length > 9 ? 13 : 16,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.05,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'font-size 0.15s ease',
              wordBreak: 'break-word',
            }}
          >
            {dest}
          </div>

          {/* Subtitle */}
          <div style={{
            marginTop: 5,
            fontSize: 6, letterSpacing: '2.5px',
            color: 'rgba(255,255,255,0.75)',
            fontFamily: 'system-ui',
            textTransform: 'uppercase',
            transition: 'opacity 0.3s',
            opacity: travelers.trim() ? 1 : 0.5,
          }}>
            {sub}
          </div>

          {/* Bottom rule */}
          <div style={{ marginTop: 8, height: 1, background: `${palette.accent}99`, width: '100%' }} />
          <div style={{
            marginTop: 5, fontSize: 5, letterSpacing: '1.5px',
            color: 'rgba(255,255,255,0.45)', fontFamily: 'system-ui', textTransform: 'uppercase',
          }}>
            TRAVEL EDITION
          </div>
        </div>

        {/* Upload prompt overlay (shown when no photo) */}
        {!photoUrl && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 4,
            pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 18, opacity: 0.3 }}>🏔</div>
            <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', fontFamily: 'system-ui' }}>
              ADD PHOTO
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 9, color: '#94a3b8', letterSpacing: '1px', fontFamily: 'system-ui' }}>
        Updates as you type
      </div>
    </div>
  );
}
