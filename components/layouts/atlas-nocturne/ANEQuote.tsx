import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const paper = '#f7f1e5';
const black = '#070707';
const muted = '#746e63';

export default function ANEQuote({ slots, fonts }: LayoutProps) {
  const quoteText = slots['quote-text'] || '';
  const quoteAttr = slots['quote-attr'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: paper }}>
      {/* Right photo */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '52%', height: '100%', overflow: 'hidden', background: '#999' }}>
        {slots['quote-photo'] ? (
          <img src={slots['quote-photo']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#bbb' }} />
        )}
      </div>

      {/* Quote box */}
      <div className="magazine-quote-wrap" style={{ position: 'absolute', left: 58, top: 170, width: 390, background: black, color: ivory, padding: '54px 48px' }}>
        <div className="magazine-label magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: champagne, marginBottom: 24 }}>
          Memory
        </div>
        <div className="magazine-quote-text magazine-copy-on-dark" style={{
          fontFamily: fonts.heading,
          fontSize: 38,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: ivory,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 6,
          WebkitBoxOrient: 'vertical',
        }}>
          &ldquo;{quoteText}&rdquo;
        </div>
        {quoteAttr && (
          <div className="magazine-quote-attr" style={{ marginTop: 34, color: champagne, fontFamily: fonts.body, fontSize: 11, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {quoteAttr}
          </div>
        )}
      </div>

      {/* Side title */}
      <div className="magazine-label" style={{ position: 'absolute', left: 70, bottom: 92, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: muted }}>
        Private travel archive
      </div>

      {/* Folio */}
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, right: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        07
      </div>
    </div>
  );
}
