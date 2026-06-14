import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';

export default function AuroraQuote({ slots, fonts, language }: LayoutProps) {
  return (
    <div style={{
      width: 794,
      height: 1123,
      position: 'relative',
      overflow: 'hidden',
      background: PAPER,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 96px',
    }}>
      {/* Decorative top teal lines */}
      <div style={{ position: 'absolute', top: 56, left: 56, right: 56, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 2, background: TEAL, opacity: 0.9 }} />
        <div style={{ height: 1, background: TEAL, opacity: 0.3 }} />
      </div>

      {/* Decorative bottom lines */}
      <div style={{ position: 'absolute', bottom: 56, left: 56, right: 56, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 1, background: TEAL, opacity: 0.3 }} />
        <div style={{ height: 2, background: TEAL, opacity: 0.9 }} />
      </div>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 38, left: 38, width: 18, height: 18, borderTop: `2px solid ${SAND}`, borderLeft: `2px solid ${SAND}` }} />
      <div style={{ position: 'absolute', top: 38, right: 38, width: 18, height: 18, borderTop: `2px solid ${SAND}`, borderRight: `2px solid ${SAND}` }} />
      <div style={{ position: 'absolute', bottom: 38, left: 38, width: 18, height: 18, borderBottom: `2px solid ${SAND}`, borderLeft: `2px solid ${SAND}` }} />
      <div style={{ position: 'absolute', bottom: 38, right: 38, width: 18, height: 18, borderBottom: `2px solid ${SAND}`, borderRight: `2px solid ${SAND}` }} />

      {/* Content */}
      <div className="magazine-quote-wrap" style={{ textAlign: 'center', maxWidth: 560 }}>
        {/* Large opening quotation mark */}
        <div className="magazine-quote-mark" style={{
          fontFamily: fonts.heading,
          fontSize: 120,
          fontWeight: 900,
          color: TEAL,
          lineHeight: 0.7,
          marginBottom: 32,
          opacity: 0.82,
        }}>
          &ldquo;
        </div>

        {/* Quote text */}
        <div className="magazine-quote-text" style={{
          fontFamily: fonts.heading,
          fontStyle: 'italic',
          fontSize: 28,
          fontWeight: 400,
          color: INK,
          lineHeight: 1.38,
          letterSpacing: '-0.01em',
          marginBottom: 36,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical',
        }}>
          {slots['quote-text'] || magazineLabel(language, 'everyJourneyWrites')}
        </div>

        {/* Sand divider */}
        <div style={{
          width: 64,
          height: 2,
          background: SAND,
          margin: '0 auto 20px',
        }} />

        {/* Attribution */}
        {slots['quote-attr'] && (
          <div className="magazine-quote-attr" style={{
            fontFamily: fonts.subheading,
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: `${INK}70`,
            fontWeight: 700,
          }}>
            {slots['quote-attr']}
          </div>
        )}
      </div>

      {/* Teal brand watermark at bottom center */}
      <div className="magazine-label" style={{
        position: 'absolute',
        bottom: 72,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: fonts.subheading,
        fontSize: 8,
        letterSpacing: '0.42em',
        textTransform: 'uppercase',
        color: `${TEAL}60`,
        fontWeight: 800,
      }}>
        {magazineLabel(language, 'brand')}
      </div>
    </div>
  );
}
