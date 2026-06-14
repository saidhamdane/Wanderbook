import { LayoutProps } from '@/lib/magazine/types';

export default function WEBack({ slots, palette, fonts }: LayoutProps) {
  const title = slots['back-title'] || 'Until We Travel Again';
  const contact = slots['back-contact'] || 'wanderbook.com';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.primary }}>
      {/* Full-bleed background photo */}
      {slots['back-photo'] && (
        <img
          src={slots['back-photo']}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
      {/* Vignette bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', zIndex: 1 }} />

      {/* Center content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 72px',
        textAlign: 'center',
      }}>
        {/* Brand mark */}
        <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 7, color: palette.accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
          Wanderbook
        </div>

        {/* Amber divider */}
        <div style={{ width: 56, height: 2, background: palette.accent, marginBottom: 24 }} />

        {/* Title */}
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 44,
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.15,
          letterSpacing: -0.5,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {title}
        </div>
      </div>

      {/* Bottom: contact / URL */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        zIndex: 2,
        textAlign: 'center',
        fontFamily: fonts.body,
        fontSize: 10,
        letterSpacing: 3,
        color: 'rgba(255,255,255,0.55)',
        textTransform: 'uppercase',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
      }}>
        {contact}
      </div>
    </div>
  );
}
