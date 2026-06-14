import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';
const MUTED = 'rgba(23,25,29,0.52)';

export default function AuroraContents({ slots, fonts, language }: LayoutProps) {
  const items = [1, 2, 3, 4, 5, 6].map((n) => slots[`toc-item-${n}`] || '');
  const pageNums = ['04', '08', '12', '16', '20', '24'];

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: PAPER, display: 'flex' }}>
      {/* Left panel — table of contents */}
      <div style={{
        width: 360,
        flexShrink: 0,
        padding: '52px 44px 44px',
        display: 'flex',
        flexDirection: 'column',
        background: PAPER,
        position: 'relative',
      }}>
        {/* Teal top rule */}
        <div style={{ width: 40, height: 3, background: TEAL, marginBottom: 28 }} />

        {/* "In This Issue" eyebrow */}
        <div className="magazine-label" style={{
          fontFamily: fonts.subheading,
          fontSize: 9,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: TEAL,
          fontWeight: 800,
          marginBottom: 12,
        }}>
          {magazineLabel(language, 'inThisIssue')}
        </div>

        {/* CONTENTS heading */}
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 52,
          fontWeight: 900,
          color: INK,
          lineHeight: 0.88,
          letterSpacing: '-0.03em',
          marginBottom: 40,
        }}>
          {magazineLabel(language, 'contents')}
        </div>

        {/* TOC items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
          {items.map((item, i) => (
            <div key={i} className="magazine-contents-row" style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              borderBottom: `1px solid ${INK}14`,
              padding: '13px 0',
            }}>
              <div className="magazine-contents-number" style={{
                fontFamily: fonts.heading,
                fontSize: 13,
                fontWeight: 900,
                color: SAND,
                lineHeight: 1,
                minWidth: 26,
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="magazine-contents-item" style={{
                fontFamily: fonts.body,
                fontSize: 11.5,
                fontWeight: 500,
                color: INK,
                lineHeight: 1.3,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
                {item || `${magazineLabel(language, 'chapter')} ${i + 1}`}
              </div>
              <div className="magazine-contents-page" style={{
                fontFamily: fonts.subheading,
                fontSize: 9,
                letterSpacing: '0.12em',
                color: MUTED,
                flexShrink: 0,
              }}>
                {pageNums[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Caption / footer */}
        {slots['toc-caption'] && (
          <div className="magazine-caption" style={{
            marginTop: 32,
            fontFamily: fonts.body,
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: MUTED,
            lineHeight: 1.5,
            borderTop: `1px solid ${INK}18`,
            paddingTop: 14,
          }}>
            {slots['toc-caption']}
          </div>
        )}
      </div>

      {/* Right panel — photo (full height) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {slots['toc-photo'] ? (
          <img
            src={slots['toc-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `${TEAL}18` }} />
        )}
        {/* Subtle left-edge gradient for smooth blend */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 40,
          background: `linear-gradient(90deg, ${PAPER}, transparent)`,
          pointerEvents: 'none',
        }} />
        {/* Sand accent line at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 4,
          background: SAND,
        }} />
      </div>
    </div>
  );
}
