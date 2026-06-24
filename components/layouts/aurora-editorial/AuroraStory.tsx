import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';
const MUTED = 'rgba(23,25,29,0.52)';

export default function AuroraStory({ slots, fonts, language }: LayoutProps) {
  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: PAPER }}>
      {/* Two-column layout */}
      <div style={{ display: 'flex', height: '100%' }}>
        {/* LEFT COLUMN: large dominant photo (420px wide, full height) */}
        <div style={{
          width: 420,
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          background: `${TEAL}20`,
        }}>
          {slots['story-photo-1'] ? (
            <img
              src={slots['story-photo-1']}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: `${TEAL}20` }} />
          )}
          {/* Right-edge gradient blend to paper */}
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 48,
            background: `linear-gradient(90deg, transparent, ${PAPER})`,
            pointerEvents: 'none',
          }} />
        </div>

        {/* RIGHT COLUMN: text + two smaller photos */}
        <div style={{
          flex: 1,
          padding: '52px 40px 44px 28px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div data-layout-block="story-text-stack" style={{ flex: 'none', overflow: 'hidden', maxHeight: 440 }}>
            {/* Eyebrow */}
            <div data-layout-block="story-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 24, height: 3, background: SAND, flexShrink: 0 }} />
              <div className="magazine-label" style={{
                fontFamily: fonts.subheading,
                fontSize: 9,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: SAND,
                fontWeight: 800,
              }}>
                {magazineLabel(language, 'theStory')}
              </div>
            </div>

            {/* Story title */}
            <div data-layout-block="story-title" style={{
              fontFamily: fonts.heading,
              fontSize: 28,
              fontWeight: 900,
              color: INK,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              marginBottom: 12,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}>
              {slots['story-title'] || magazineLabel(language, 'untilWeReturn')}
            </div>

            {/* Story lead — italic pull */}
            {slots['story-lead'] && (
              <div data-layout-block="story-lead" className="magazine-copy" style={{
                fontFamily: fonts.heading,
                fontStyle: 'italic',
                fontSize: 12.5,
                color: TEAL,
                lineHeight: 1.4,
                marginBottom: 14,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {slots['story-lead']}
              </div>
            )}

            {/* Sand rule */}
            <div data-layout-block="story-rule" style={{ width: 32, height: 1.5, background: SAND, marginBottom: 14 }} />

            {/* Story body */}
            <div data-layout-block="story-body" className="magazine-copy" style={{
              fontFamily: fonts.body,
              fontSize: 10.5,
              lineHeight: 1.72,
              color: `${INK}c2`,
              marginBottom: 16,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              flex: 'none',
            }}>
              {slots['story-body'] || ''}
            </div>
          </div>

          {/* Two stacked smaller photos */}
          <div data-layout-block="story-photo-stack" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
            {['story-photo-2', 'story-photo-3'].map((key, i) => (
              <div key={key} style={{
                flex: 1,
                overflow: 'hidden',
                background: `${TEAL}18`,
                position: 'relative',
                minHeight: 0,
              }}>
                {slots[key] ? (
                  <img
                    src={slots[key]}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: `${TEAL}14` }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom teal rule */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 4, background: TEAL,
      }} />
    </div>
  );
}
