import { LayoutProps } from '@/lib/magazine/types';

const paper = '#f7f1e5';
const ivory = '#fffaf0';
const muted = '#746e63';

export default function ANEHero({ slots, fonts }: LayoutProps) {
  const title = slots['hero-title'] || 'The destination in full light.';
  const subtitle = slots['hero-subtitle'] || '';
  const body = slots['hero-body'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: ivory }}>
      {/* Top full-bleed photo */}
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 570, overflow: 'hidden', background: '#555' }}>
        {slots['hero-photo'] ? (
          <img src={slots['hero-photo']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#888' }} />
        )}
        {/* Fade to paper at bottom */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 50%, ${ivory} 100%)` }} />
      </div>

      {/* Content card */}
      <div style={{
        position: 'absolute',
        left: 58,
        right: 58,
        bottom: 94,
        background: paper,
        padding: '44px 50px',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 38,
        boxShadow: '0 4px 40px rgba(0,0,0,.08)',
      }}>
        <div>
          <div className="magazine-label" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: muted, marginBottom: 14 }}>
            Feature
          </div>
          <div style={{
            fontFamily: fonts.heading,
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 0.94,
            letterSpacing: '-0.045em',
            color: '#121212',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </div>
          {subtitle && (
            <div className="magazine-copy" style={{
              fontFamily: fonts.body,
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.35,
              color: '#26231e',
              margin: '16px 0 0',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {subtitle}
            </div>
          )}
        </div>
        {body && (
          <div className="magazine-copy" style={{
            fontFamily: fonts.body,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: '#26231e',
            maxHeight: 240,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 11,
            WebkitBoxOrient: 'vertical',
            paddingTop: 34,
          }}>
            {body}
          </div>
        )}
      </div>

      {/* Folio */}
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, right: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        04
      </div>
    </div>
  );
}
