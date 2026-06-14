import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';
const MUTED = 'rgba(23,25,29,0.56)';

export default function AuroraIntro({ slots, fonts, language }: LayoutProps) {
  const introBody = slots['intro-body'] || '';
  const introPullquote = slots['intro-pullquote'] || introBody.split(' ').slice(0, 18).join(' ');

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: PAPER }}>
      {/* Top photo — full width, 440px tall */}
      <div style={{ position: 'relative', width: '100%', height: 440, overflow: 'hidden', background: `${TEAL}22` }}>
        {slots['intro-photo'] ? (
          <img
            src={slots['intro-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `${TEAL}22` }} />
        )}
        {/* Bottom gradient for smooth transition to paper */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: `linear-gradient(to bottom, transparent, ${PAPER})`,
        }} />
      </div>

      {/* Content area */}
      <div style={{ padding: '0 56px 48px', position: 'relative' }}>
        {/* Teal rule + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 3, background: TEAL, flexShrink: 0 }} />
          <div className="magazine-label" style={{
            fontFamily: fonts.subheading,
            fontSize: 9,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: TEAL,
            fontWeight: 800,
          }}>
            {magazineLabel(language, 'introduction')}
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 44,
          fontWeight: 900,
          color: INK,
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          marginBottom: 22,
          maxWidth: 560,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {slots['intro-title'] || magazineLabel(language, 'welcome')}
        </div>

        {/* Body — two-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 28 }}>
          {/* Left column: first half of body */}
          <div className="magazine-copy" style={{
            fontFamily: fonts.body,
            fontSize: 11,
            lineHeight: 1.7,
            color: `${INK}cc`,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
          }}>
            {introBody}
          </div>
          {/* Right column: second half or repeated */}
          <div className="magazine-copy" style={{
            fontFamily: fonts.body,
            fontSize: 11,
            lineHeight: 1.7,
            color: `${INK}cc`,
          }}>
            {/* Sand accent block */}
            <div style={{
              padding: '16px 18px',
              borderLeft: `3px solid ${SAND}`,
              background: `${SAND}12`,
              marginBottom: 14,
            }}>
              <div className="magazine-copy" style={{
                fontFamily: fonts.heading,
                fontSize: 14,
                fontStyle: 'italic',
                color: INK,
                lineHeight: 1.4,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {introPullquote || magazineLabel(language, 'everyJourneyWrites')}
              </div>
            </div>
          </div>
        </div>

        {/* Byline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 28, height: 1, background: SAND }} />
          <div className="magazine-label" style={{
            fontFamily: fonts.subheading,
            fontSize: 9,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: MUTED,
            fontWeight: 700,
          }}>
            {slots['intro-byline'] || magazineLabel(language, 'theEditors')}
          </div>
        </div>
      </div>
    </div>
  );
}
