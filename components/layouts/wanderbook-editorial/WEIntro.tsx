import { LayoutProps } from '@/lib/magazine/types';

export default function WEIntro({ slots, palette, fonts }: LayoutProps) {
  const title = slots['intro-title'] || 'A Journey Begins';
  const body = slots['intro-body'] || '';
  const byline = slots['intro-byline'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.background }}>
      {/* Top photo — landscape hero */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 520 }}>
        {slots['intro-photo'] ? (
          <img
            src={slots['intro-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: palette.light }} />
        )}
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, ' + palette.background + ', transparent)' }} />
      </div>

      {/* Amber accent bar left edge */}
      <div style={{ position: 'absolute', top: 540, left: 48, width: 3, height: 56, background: palette.accent }} />

      {/* Content below photo */}
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, bottom: 0, padding: '32px 48px 36px' }}>
        {/* Two-column layout */}
        <div style={{ display: 'flex', gap: 40, height: '100%' }}>
          {/* Left: title */}
          <div style={{ flex: '0 0 46%' }}>
            <div style={{
              fontFamily: fonts.heading,
              fontSize: 38,
              fontWeight: 900,
              color: palette.primary,
              lineHeight: 1.08,
              letterSpacing: -0.5,
              marginTop: 8,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
            }}>
              {title}
            </div>
          </div>

          {/* Right: body + byline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{
              fontFamily: fonts.body,
              fontSize: 12,
              lineHeight: 1.85,
              color: palette.text,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 12,
              WebkitBoxOrient: 'vertical',
            }}>
              {body}
            </div>
            {byline && (
              <div style={{
                marginTop: 20,
                fontFamily: fonts.body,
                fontSize: 10,
                fontStyle: 'italic',
                color: palette.accent,
                letterSpacing: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}>
                — {byline}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom page rule */}
      <div style={{ position: 'absolute', bottom: 24, left: 48, right: 48, height: 1, background: palette.light }} />
      <div style={{ position: 'absolute', bottom: 12, left: 48, fontFamily: fonts.body, fontSize: 8, letterSpacing: 3, color: '#aaa', textTransform: 'uppercase' }}>
        Wanderbook · Introduction
      </div>
    </div>
  );
}
