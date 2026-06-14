import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const black = '#070707';

export default function ANECover({ slots, fonts }: LayoutProps) {
  const title = slots['cover-title'] || 'DESTINATION';
  const kicker = slots['cover-kicker'] || '';
  const subtitle = slots['cover-subtitle'] || '';
  const coverDate = slots['cover-date'] || '';
  const coverLine = slots['cover-line'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: black, color: ivory }}>
      {/* Full-bleed hero photo */}
      {slots['cover-photo'] ? (
        <img
          src={slots['cover-photo']}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }} />
      )}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.24) 42%, rgba(0,0,0,.82) 100%)',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 72% 28%, rgba(201,162,93,.18), transparent 38%)',
        zIndex: 1,
      }} />

      {/* Decorative frame */}
      <div style={{ position: 'absolute', inset: 42, border: '1px solid rgba(226,201,143,.52)', zIndex: 2 }} />

      {/* Top bar: brand + date */}
      <div style={{ position: 'absolute', top: 64, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 3 }}>
        <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 12, fontWeight: 800, letterSpacing: '0.34em', textTransform: 'uppercase', color: ivory }}>
          Atlas Nocturne
        </div>
        {coverDate && (
          <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, lineHeight: 1.7, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,250,240,.82)', textAlign: 'right', whiteSpace: 'pre-line' }}>
            {coverDate}
          </div>
        )}
      </div>

      {/* Title block */}
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 206, zIndex: 3 }}>
        {kicker && (
          <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: champagne, marginBottom: 14 }}>
            {kicker}
          </div>
        )}
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 88,
          fontWeight: 700,
          lineHeight: 0.84,
          letterSpacing: '-0.055em',
          color: ivory,
          maxWidth: 560,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {title}
        </div>
        {subtitle && (
          <div className="magazine-copy magazine-copy-on-dark" style={{
            marginTop: 22,
            maxWidth: 430,
            fontFamily: fonts.body,
            fontSize: 17,
            lineHeight: 1.35,
            color: 'rgba(255,250,240,.9)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Bottom line with champagne bar */}
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 72, zIndex: 3, display: 'grid', gridTemplateColumns: '120px 1fr', gap: 28, alignItems: 'center' }}>
        <div style={{ height: 1, background: champagne }} />
        {coverLine && (
          <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 11, letterSpacing: '0.19em', textTransform: 'uppercase', color: 'rgba(255,250,240,.82)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {coverLine}
          </div>
        )}
      </div>
    </div>
  );
}
