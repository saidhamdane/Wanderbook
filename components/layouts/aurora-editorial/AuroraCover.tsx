import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';

export default function AuroraCover({ slots, fonts, language }: LayoutProps) {
  const year = slots['cover-year'] || slots['year'] || slots['edition']?.match(/\b20\d{2}\b/)?.[0] || '';
  const edition = slots['edition'] || undefined;

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: INK }}>
      {/* Full-bleed cover photo */}
      {slots['cover-photo'] && (
        <img
          src={slots['cover-photo']}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Gradient: very light dark veil at top, then photo, then paper wash at bottom */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(23,25,29,0.68) 0%, rgba(23,25,29,0.06) 38%, rgba(246,243,236,0.0) 52%, rgba(246,243,236,0.92) 76%, #f6f3ec 100%)',
      }} />

      {/* Top bar: brand left + edition right */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        padding: '30px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div className="magazine-label magazine-copy-on-dark" style={{
          fontFamily: fonts.subheading,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.38em',
          color: '#fff',
          textTransform: 'uppercase',
        }}>
          {magazineLabel(language, 'brand')}
        </div>
        {edition && (
          <div className="magazine-label" style={{
            fontFamily: fonts.body,
            fontSize: 9,
            letterSpacing: '0.26em',
            color: SAND,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {edition}
          </div>
        )}
      </div>

      {/* Bottom content block — sits on the paper zone */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2, padding: '0 48px 44px' }}>
        {/* Teal accent rule */}
        <div style={{ width: 52, height: 3, background: TEAL, marginBottom: 18 }} />

        {/* Kicker */}
        {slots['cover-kicker'] && (
          <div className="magazine-label" style={{
            fontFamily: fonts.subheading,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: TEAL,
            marginBottom: 14,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['cover-kicker']}
          </div>
        )}

        {/* Large destination title */}
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 82,
          fontWeight: 900,
          color: INK,
          lineHeight: 0.86,
          letterSpacing: '-0.03em',
          marginBottom: 22,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {slots['cover-title'] || 'DESTINATION'}
        </div>

        {/* Divider + year */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: `${INK}28` }} />
          <div className="magazine-label" style={{
            fontFamily: fonts.subheading,
            fontSize: 10,
            letterSpacing: '0.28em',
            color: `${INK}70`,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            {year}
          </div>
        </div>

        {/* Feature lines */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {slots['cover-line-1'] && (
            <span className="magazine-label" style={{
              fontFamily: fonts.subheading,
              fontSize: 9,
              letterSpacing: '0.22em',
              color: `${INK}85`,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              {slots['cover-line-1']}
            </span>
          )}
          {slots['cover-line-1'] && slots['cover-line-2'] && (
            <span style={{ color: SAND, fontSize: 11, fontWeight: 700, lineHeight: 1 }}>·</span>
          )}
          {slots['cover-line-2'] && (
            <span className="magazine-label" style={{
              fontFamily: fonts.subheading,
              fontSize: 9,
              letterSpacing: '0.22em',
              color: `${INK}85`,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              {slots['cover-line-2']}
            </span>
          )}
        </div>

        {/* Stat */}
        {slots['cover-stat'] && (
          <div className="magazine-caption" style={{
            marginTop: 12,
            fontFamily: fonts.subheading,
            fontSize: 8,
            letterSpacing: '0.26em',
            color: SAND,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {slots['cover-stat']}
          </div>
        )}
      </div>
    </div>
  );
}
