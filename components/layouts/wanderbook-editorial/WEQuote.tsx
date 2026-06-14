import { LayoutProps } from '@/lib/magazine/types';

export default function WEQuote({ slots, palette, fonts }: LayoutProps) {
  const quoteText = slots['quote-text'] || 'Every journey leaves its mark on the soul.';
  const attr = slots['quote-attr'] || '';

  return (
    <div style={{
      width: 794,
      height: 1123,
      position: 'relative',
      overflow: 'hidden',
      background: palette.primary,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 72px',
    }}>
      {/* Large decorative quote mark */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 56,
        fontFamily: fonts.heading,
        fontSize: 220,
        color: palette.accent,
        opacity: 0.12,
        lineHeight: 1,
        userSelect: 'none',
      }}>
        &ldquo;
      </div>

      {/* Subtle texture: horizontal lines */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(transparent, transparent 39px, rgba(255,255,255,0.025) 39px, rgba(255,255,255,0.025) 40px)' }} />

      {/* Amber top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 4, background: `linear-gradient(to right, transparent, ${palette.accent}, transparent)` }} />

      {/* Quote text */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        fontFamily: fonts.heading,
        fontSize: 36,
        fontWeight: 700,
        color: '#FFFFFF',
        lineHeight: 1.45,
        textAlign: 'center',
        letterSpacing: 0.3,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 8,
        WebkitBoxOrient: 'vertical',
      }}>
        {quoteText}
      </div>

      {/* Attribution */}
      {attr && (
        <div style={{
          position: 'relative',
          zIndex: 1,
          marginTop: 36,
          fontFamily: fonts.body,
          fontSize: 11,
          letterSpacing: 3,
          color: palette.accent,
          textTransform: 'uppercase',
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
        }}>
          — {attr}
        </div>
      )}

      {/* Amber bottom accent bar */}
      <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 4, background: `linear-gradient(to right, transparent, ${palette.accent}, transparent)` }} />

      {/* Bottom brand */}
      <div style={{ position: 'absolute', bottom: 28, right: 48, fontFamily: fonts.heading, fontSize: 10, letterSpacing: 5, color: 'rgba(200,151,58,0.5)', textTransform: 'uppercase' }}>
        Wanderbook
      </div>
    </div>
  );
}
