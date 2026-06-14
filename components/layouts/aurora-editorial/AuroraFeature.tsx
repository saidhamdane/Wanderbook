import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';

export default function AuroraFeature({ slots, fonts, language }: LayoutProps) {
  const stats = [
    slots['feature-stat-1'] || 'Golden light',
    slots['feature-stat-2'] || 'Hidden corners',
    slots['feature-stat-3'] || 'Local rhythm',
  ];

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: PAPER }}>
      {/* Full-width feature photo — top 460px */}
      <div style={{ position: 'relative', width: '100%', height: 460, overflow: 'hidden', background: `${INK}18` }}>
        {slots['feature-photo'] ? (
          <img
            src={slots['feature-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `${TEAL}28` }} />
        )}
        {/* Dark overlay for text contrast at bottom edge */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to bottom, transparent, rgba(23,25,29,0.28))',
        }} />
      </div>

      {/* 3-stat strip below photo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        background: TEAL,
        color: '#fff',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.18)' : 'none',
          }}>
            <div className="magazine-label magazine-copy-on-dark" style={{
              fontFamily: fonts.subheading,
              fontSize: 9,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              marginBottom: 5,
              fontWeight: 700,
            }}>
              0{i + 1}
            </div>
            <div className="magazine-caption magazine-caption-on-image" style={{
              fontFamily: fonts.heading,
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.2,
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

      {/* Text content area */}
      <div style={{ padding: '36px 52px 44px', display: 'grid', gridTemplateColumns: '1fr 0.86fr', gap: 36 }}>
        {/* Left: title */}
        <div>
          <div className="magazine-label" style={{
            fontFamily: fonts.subheading,
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: SAND,
            fontWeight: 800,
            marginBottom: 14,
          }}>
          {magazineLabel(language, 'feature')}
          </div>
          <div style={{
            fontFamily: fonts.heading,
            fontSize: 36,
            fontWeight: 900,
            color: INK,
            lineHeight: 1.0,
            letterSpacing: '-0.025em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['feature-title'] || magazineLabel(language, 'featureStory')}
          </div>
          {/* Sand accent bar */}
          <div style={{ width: 40, height: 3, background: SAND, marginTop: 20 }} />
        </div>

        {/* Right: body copy */}
        <div className="magazine-copy" style={{
          fontFamily: fonts.body,
          fontSize: 11,
          lineHeight: 1.72,
          color: `${INK}c0`,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 11,
          WebkitBoxOrient: 'vertical',
        }}>
          {slots['feature-body'] || ''}
        </div>
      </div>

      {/* Bottom teal accent strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 6,
        background: `linear-gradient(90deg, ${TEAL}, ${SAND})`,
      }} />
    </div>
  );
}
