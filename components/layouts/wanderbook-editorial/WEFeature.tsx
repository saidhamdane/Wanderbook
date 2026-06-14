import { LayoutProps } from '@/lib/magazine/types';

export default function WEFeature({ slots, palette, fonts }: LayoutProps) {
  const stats = [
    slots['feature-stat-1'],
    slots['feature-stat-2'],
    slots['feature-stat-3'],
  ].filter(Boolean);

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.primary, display: 'flex' }}>
      {/* Left: full-height photo */}
      <div style={{ width: 360, height: '100%', position: 'relative', flexShrink: 0 }}>
        {slots['feature-photo'] ? (
          <img
            src={slots['feature-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#2c2c2e' }} />
        )}
        {/* Right edge fade */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: '100%', background: 'linear-gradient(to right, transparent, ' + palette.primary + ')' }} />
      </div>

      {/* Right: text content */}
      <div style={{ flex: 1, padding: '56px 44px 44px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top section */}
        <div>
          {/* Label */}
          <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 5, color: palette.accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>
            Feature Story
          </div>

          {/* Amber accent bar */}
          <div style={{ width: 40, height: 3, background: palette.accent, marginBottom: 20 }} />

          {/* Title */}
          <div style={{
            fontFamily: fonts.heading,
            fontSize: 34,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: -0.3,
            marginBottom: 24,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['feature-title'] || 'The Heart of the Journey'}
          </div>

          {/* Body */}
          <div style={{
            fontFamily: fonts.body,
            fontSize: 11.5,
            lineHeight: 1.9,
            color: 'rgba(255,255,255,0.75)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 11,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['feature-body'] || ''}
          </div>
        </div>

        {/* Stats section */}
        {stats.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 24 }} />
            <div style={{ display: 'flex', gap: 16 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ flex: 1, padding: '14px 12px', border: '1px solid rgba(200,151,58,0.35)', borderRadius: 2 }}>
                  <div style={{
                    fontFamily: fonts.body,
                    fontSize: 10,
                    letterSpacing: 1.5,
                    color: 'rgba(255,255,255,0.65)',
                    textTransform: 'uppercase',
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {stat}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer brand */}
        <div style={{ marginTop: 28, fontFamily: fonts.heading, fontSize: 9, letterSpacing: 5, color: 'rgba(200,151,58,0.6)', textTransform: 'uppercase' }}>
          Wanderbook
        </div>
      </div>
    </div>
  );
}
