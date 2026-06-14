import { LayoutProps } from '@/lib/magazine/types';

export default function WECover({ slots, palette, fonts }: LayoutProps) {
  const year = slots['cover-year'] || String(new Date().getFullYear());
  const stat = slots['cover-stat'] || '';
  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.primary }}>
      {/* Full-bleed background photo */}
      {slots['cover-photo'] && (
        <img
          src={slots['cover-photo']}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
      {/* Dark scrim top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '38%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, transparent 100%)', zIndex: 1 }} />
      {/* Dark scrim bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', zIndex: 1 }} />

      {/* Top bar: WANDERBOOK brand + edition */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2, padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: fonts.heading, fontSize: 13, letterSpacing: 6, color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase', fontWeight: 700 }}>
          Wanderbook
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 4, color: palette.accent, textTransform: 'uppercase', fontWeight: 600, textAlign: 'right' }}>
          {slots['edition'] || 'Travel Edition'}
        </div>
      </div>

      {/* Center: title block */}
      <div style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, zIndex: 2, padding: '0 36px', textAlign: 'center' }}>
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 86,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 0.9,
          letterSpacing: -1,
          textTransform: 'uppercase',
          textShadow: '0 4px 24px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {slots['cover-title'] || 'DESTINATION'}
        </div>
        {slots['cover-kicker'] && (
          <div style={{
            marginTop: 12,
            fontFamily: fonts.body,
            fontSize: 13,
            letterSpacing: 3,
            color: 'rgba(255,255,255,0.82)',
            textTransform: 'uppercase',
            fontWeight: 400,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['cover-kicker']}
          </div>
        )}
      </div>

      {/* Bottom content area */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, padding: '0 36px 32px' }}>
        {/* Amber divider */}
        <div style={{ width: 48, height: 2, backgroundColor: palette.accent, marginBottom: 14 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            {slots['cover-line-1'] && (
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginBottom: 5 }}>
                {slots['cover-line-1']}
              </div>
            )}
            {slots['cover-line-2'] && (
              <div style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>
                {slots['cover-line-2']}
              </div>
            )}
          </div>
          {/* Year + stat badge */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 700, color: palette.accent, lineHeight: 1 }}>
              {year}
            </div>
            {stat && (
              <div style={{ fontFamily: fonts.body, fontSize: 8, letterSpacing: 2.5, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginTop: 3 }}>
                {stat}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
